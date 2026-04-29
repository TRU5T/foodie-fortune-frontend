import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

// Direct-send mode: this function calls Resend directly instead of enqueuing
// to pgmq. This is required because the project runs on external Supabase
// without the managed email queue infrastructure.

const SITE_NAME = 'Redeemr'
// Use the already-verified sender on redeemr.app while notify.redeemr.app
// DNS is still propagating. Switch to noreply@notify.redeemr.app once verified.
const FROM_ADDRESS = `${SITE_NAME} <info@redeemr.app>`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const resendApiKey = Deno.env.get('RESEND_API_KEY')

  if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
    console.error('Missing required environment variables')
    return jsonResponse({ error: 'Server configuration error' }, 500)
  }

  let templateName: string
  let recipientEmail: string
  let idempotencyKey: string
  let messageId: string
  let templateData: Record<string, any> = {}
  try {
    const body = await req.json()
    templateName = body.templateName || body.template_name
    recipientEmail = body.recipientEmail || body.recipient_email
    messageId = crypto.randomUUID()
    idempotencyKey = body.idempotencyKey || body.idempotency_key || messageId
    if (body.templateData && typeof body.templateData === 'object') {
      templateData = body.templateData
    }
  } catch {
    return jsonResponse({ error: 'Invalid JSON in request body' }, 400)
  }

  if (!templateName) {
    return jsonResponse({ error: 'templateName is required' }, 400)
  }

  const template = TEMPLATES[templateName]
  if (!template) {
    return jsonResponse(
      {
        error: `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(', ')}`,
      },
      404,
    )
  }

  const effectiveRecipient = template.to || recipientEmail
  if (!effectiveRecipient) {
    return jsonResponse(
      { error: 'recipientEmail is required (unless the template defines a fixed recipient)' },
      400,
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const normalizedEmail = effectiveRecipient.toLowerCase()

  // Best-effort suppression check. If the table doesn't exist on this project,
  // skip rather than failing the send.
  try {
    const { data: suppressed } = await supabase
      .from('suppressed_emails')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (suppressed) {
      console.log('Email suppressed', { effectiveRecipient, templateName })
      return jsonResponse({ success: false, reason: 'email_suppressed' })
    }
  } catch (err) {
    console.warn('Suppression check skipped (table may not exist)', err)
  }

  // Best-effort unsubscribe token (one per email). Skip silently if missing.
  let unsubscribeToken: string | null = null
  try {
    const { data: existingToken } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token, used_at')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (existingToken && !existingToken.used_at) {
      unsubscribeToken = existingToken.token
    } else if (!existingToken) {
      const newToken = generateToken()
      const { error: tokenError } = await supabase
        .from('email_unsubscribe_tokens')
        .upsert(
          { token: newToken, email: normalizedEmail },
          { onConflict: 'email', ignoreDuplicates: true },
        )
      if (!tokenError) {
        const { data: stored } = await supabase
          .from('email_unsubscribe_tokens')
          .select('token')
          .eq('email', normalizedEmail)
          .maybeSingle()
        unsubscribeToken = stored?.token ?? newToken
      }
    }
  } catch (err) {
    console.warn('Unsubscribe token step skipped (table may not exist)', err)
  }

  // Render template
  const html = await renderAsync(
    React.createElement(template.component, templateData),
  )
  const plainText = await renderAsync(
    React.createElement(template.component, templateData),
    { plainText: true },
  )

  const resolvedSubject =
    typeof template.subject === 'function'
      ? template.subject(templateData)
      : template.subject

  // Append unsubscribe footer (matches the managed-pipeline behaviour).
  const projectRef = (supabaseUrl.match(/^https:\/\/([^.]+)\./) || [])[1]
  const unsubscribeUrl =
    unsubscribeToken && projectRef
      ? `https://${projectRef}.supabase.co/functions/v1/handle-email-unsubscribe?token=${unsubscribeToken}`
      : null

  let finalHtml = html
  let finalText = plainText
  if (unsubscribeUrl) {
    finalHtml += `<div style="font-size:12px;color:#94a3b8;text-align:center;padding:24px;font-family:Arial,sans-serif;">You are receiving this email from ${SITE_NAME}. <a href="${unsubscribeUrl}" style="color:#94a3b8;">Unsubscribe</a>.</div>`
    finalText += `\n\n---\nYou are receiving this email from ${SITE_NAME}.\nUnsubscribe: ${unsubscribeUrl}`
  }

  // Log pending
  try {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: effectiveRecipient,
      status: 'pending',
    })
  } catch {
    // log table may not exist; continue
  }

  // Send directly via Resend
  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [effectiveRecipient],
      subject: resolvedSubject,
      html: finalHtml,
      text: finalText,
      ...(unsubscribeUrl
        ? {
            headers: {
              'List-Unsubscribe': `<${unsubscribeUrl}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          }
        : {}),
    }),
  })

  if (!resendRes.ok) {
    const errorBody = await resendRes.text()
    console.error('Resend send failed', {
      status: resendRes.status,
      body: errorBody,
      templateName,
      effectiveRecipient,
    })
    try {
      await supabase.from('email_send_log').insert({
        message_id: messageId,
        template_name: templateName,
        recipient_email: effectiveRecipient,
        status: 'failed',
        error_message: `Resend ${resendRes.status}: ${errorBody.slice(0, 500)}`,
      })
    } catch {
      // ignore
    }
    return jsonResponse(
      { error: 'Email provider rejected the send', details: errorBody },
      502,
    )
  }

  const resendData = await resendRes.json()

  try {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: effectiveRecipient,
      status: 'sent',
      provider_message_id: resendData?.id ?? null,
    })
  } catch {
    // ignore
  }

  console.log('Transactional email sent', {
    templateName,
    effectiveRecipient,
    providerId: resendData?.id,
  })

  return jsonResponse({ success: true, sent: true, providerId: resendData?.id })
})
