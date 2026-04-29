/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Redeemr'
const SITE_URL = 'https://redeemr.app'

interface WelcomeProps {
  name?: string
}

const WelcomeEmail = ({ name }: WelcomeProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to {SITE_NAME} — start collecting rewards</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>Redeemr</Text>
        <Heading style={h1}>
          {name ? `Welcome, ${name}! 🎉` : 'Welcome to Redeemr! 🎉'}
        </Heading>
        <Text style={text}>
          Thanks for joining {SITE_NAME}. You can now collect stamps, earn points,
          and redeem rewards at all your favourite local spots — straight from your phone.
        </Text>
        <Button style={button} href={SITE_URL}>
          Open Redeemr
        </Button>
        <Text style={footer}>
          Got a business? You can list it on Redeemr and start running your own loyalty program.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeEmail,
  subject: 'Welcome to Redeemr 🎉',
  displayName: 'Welcome email',
  previewData: { name: 'Sam' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brand = { fontSize: '13px', fontWeight: 700 as const, color: '#F97316', letterSpacing: '0.08em', textTransform: 'uppercase' as const, margin: '0 0 24px' }
const h1 = { fontSize: '26px', fontWeight: 700 as const, color: '#0f172a', margin: '0 0 16px', lineHeight: '1.25' }
const text = { fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: '0 0 24px' }
const button = { backgroundColor: '#F97316', color: '#ffffff', fontSize: '15px', fontWeight: 600 as const, borderRadius: '8px', padding: '13px 24px', textDecoration: 'none', display: 'inline-block' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '32px 0 0', lineHeight: '1.5' }
