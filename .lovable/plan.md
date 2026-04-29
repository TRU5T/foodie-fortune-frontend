# Wire transactional emails + send test

## 1. New template: contact-confirmation

Create `supabase/functions/_shared/transactional-email-templates/contact-confirmation.tsx` — branded orange/white React Email matching the existing `welcome.tsx`. Thanks the sender by name and echoes their submitted subject line.

Register it in `registry.ts` alongside `welcome`:

```ts
import { template as contactConfirmation } from './contact-confirmation.tsx'

export const TEMPLATES = {
  'welcome': welcome,
  'contact-confirmation': contactConfirmation,
}
```

## 2. Wire welcome email on signup

In `src/context/AuthContext.tsx`, update `signUp` to capture `data.user` from `supabase.auth.signUp` and fire-and-forget the welcome email after a successful signup:

```ts
supabase.functions.invoke('send-transactional-email', {
  body: {
    templateName: 'welcome',
    recipientEmail: email,
    idempotencyKey: `welcome-${data.user.id}`,
    templateData: { name: fullName },
  },
}).catch((err) => console.error('Welcome email failed:', err));
```

Wrapped so a queue failure never blocks signup.

## 3. Migrate contact form to transactional pipeline

In `src/pages/Contact.tsx`:
- Keep the existing `send-contact-email` call (notifies the team at info@redeemr.app).
- Add a second call to `send-transactional-email` with `templateName: 'contact-confirmation'` so the **sender** gets a branded confirmation through the queue (retries + logging + suppression handling).
- Idempotency key: `contact-${crypto.randomUUID()}`.
- Pass `{ name, subject }` as templateData.

## 4. Deploy

Deploy `send-transactional-email` so the new registry entry is live.

## 5. Test send to your inbox

Invoke `send-transactional-email` with `templateName: 'welcome'` and recipient `sam2911@live.com.au`, then query `email_send_log` to confirm the result.

## ⚠️ DNS still pending

`notify.redeemr.app` is currently **awaiting DNS verification**. The test send will:
- Successfully enqueue (you'll see `pending` then likely stay there until DNS verifies).
- **Not actually deliver to your inbox** until NS records propagate.

Once DNS is verified (handled automatically by Lovable once records propagate), the queued email will go out on the next dispatcher cycle. Finishing DNS in **Project Settings → Email** is required for actual delivery.

## Files changed

- `supabase/functions/_shared/transactional-email-templates/contact-confirmation.tsx` (new)
- `supabase/functions/_shared/transactional-email-templates/registry.ts` (add entry)
- `src/context/AuthContext.tsx` (welcome email on signup)
- `src/pages/Contact.tsx` (sender confirmation via transactional pipeline)
- Deploy `send-transactional-email`
