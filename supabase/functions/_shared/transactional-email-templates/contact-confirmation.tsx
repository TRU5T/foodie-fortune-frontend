/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Redeemr'

interface ContactConfirmationProps {
  name?: string
  subject?: string
}

const ContactConfirmationEmail = ({ name, subject }: ContactConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for reaching out to {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>Redeemr</Text>
        <Heading style={h1}>
          {name ? `Thanks, ${name}!` : 'Thanks for reaching out!'}
        </Heading>
        <Text style={text}>
          We've received your message and a member of our team will get back to
          you within 24 hours.
        </Text>
        {subject && (
          <>
            <Hr style={hr} />
            <Text style={metaLabel}>Your subject</Text>
            <Text style={metaValue}>{subject}</Text>
          </>
        )}
        <Hr style={hr} />
        <Text style={footer}>
          If you didn't send this message, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactConfirmationEmail,
  subject: 'We got your message — Redeemr',
  displayName: 'Contact form confirmation',
  previewData: { name: 'Sam', subject: 'Question about loyalty cards' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brand = { fontSize: '13px', fontWeight: 700 as const, color: '#F97316', letterSpacing: '0.08em', textTransform: 'uppercase' as const, margin: '0 0 24px' }
const h1 = { fontSize: '26px', fontWeight: 700 as const, color: '#0f172a', margin: '0 0 16px', lineHeight: '1.25' }
const text = { fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: '0 0 16px' }
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const metaLabel = { fontSize: '12px', fontWeight: 600 as const, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 4px' }
const metaValue = { fontSize: '15px', color: '#0f172a', margin: '0 0 8px', lineHeight: '1.5' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '8px 0 0', lineHeight: '1.5' }
