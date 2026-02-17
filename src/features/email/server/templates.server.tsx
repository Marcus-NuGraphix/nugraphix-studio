import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { render } from '@react-email/render'
import type { EmailTemplateKey } from '@/features/email/model/types'
import { brandConfig } from '@/components/brand/brand.config'

const styles = {
  body: {
    backgroundColor: '#f6f9fc',
    fontFamily: 'Inter, Arial, sans-serif',
    margin: 0,
    padding: 0,
  },
  container: {
    margin: '0 auto',
    padding: '24px',
    maxWidth: '560px',
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: '22px',
    fontWeight: '700',
    lineHeight: '1.35',
    margin: '0 0 12px',
    color: '#0f172a',
  },
  text: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#334155',
    margin: '0 0 12px',
  },
  muted: {
    fontSize: '12px',
    lineHeight: '1.5',
    color: '#64748b',
    margin: 0,
  },
  button: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    borderRadius: '8px',
    textDecoration: 'none',
    padding: '10px 18px',
    fontWeight: '600',
    display: 'inline-block',
  },
} as const

type EmailTemplatePayloadMap = {
  'auth-welcome': {
    name: string
    dashboardUrl: string
  }
  'auth-verify-email': {
    name: string
    verificationUrl: string
  }
  'auth-reset-password': {
    name: string
    resetUrl: string
  }
  'security-password-changed': {
    name: string
    securityUrl: string
    timestamp: string
  }
  'security-sessions-revoked': {
    name: string
    securityUrl: string
    timestamp: string
  }
  'editorial-blog-published': {
    title: string
    excerpt?: string | null
    postUrl: string
    manageUrl: string
    unsubscribeUrl?: string | null
  }
  'editorial-press-published': {
    title: string
    summary?: string | null
    releaseUrl: string
    manageUrl: string
    unsubscribeUrl?: string | null
  }
  'contact-admin-notification': {
    name: string
    email: string
    phone: string
    suburb: string
    serviceInterest: string
    propertyType: string
    urgency: string
    preferredContactMethod: string
    bestContactTime: string
    subject: string
    message: string
    sourcePath: string
  }
  'contact-user-confirmation': {
    name: string
    supportEmail: string
  }
}

export type EmailTemplatePayload<TTemplateKey extends EmailTemplateKey> =
  EmailTemplatePayloadMap[TTemplateKey]

interface BuiltTemplate {
  subject: string
  html: string
  text: string
}

const templateLink = (
  manageUrl: string,
  unsubscribeUrl?: string | null,
): { label: string; href: string } => {
  if (unsubscribeUrl) {
    return { label: 'Unsubscribe', href: unsubscribeUrl }
  }

  return { label: 'Manage preferences', href: manageUrl }
}

const formatLeadValue = (value: string) =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const renderTemplate = async ({
  preview,
  heading,
  paragraphs,
  primaryCta,
  footer,
}: {
  preview: string
  heading: string
  paragraphs: Array<string>
  primaryCta?: { label: string; href: string }
  footer?: { label: string; href: string }
}) => {
  const html = await render(
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>{heading}</Heading>
          {paragraphs.map((paragraph) => (
            <Text key={paragraph} style={styles.text}>
              {paragraph}
            </Text>
          ))}

          {primaryCta ? (
            <Section style={{ margin: '20px 0' }}>
              <Button href={primaryCta.href} style={styles.button}>
                {primaryCta.label}
              </Button>
            </Section>
          ) : null}

          {footer ? (
            <>
              <Hr style={{ margin: '20px 0', borderColor: '#e2e8f0' }} />
              <Text style={styles.muted}>
                <Link href={footer.href}>{footer.label}</Link>
              </Text>
            </>
          ) : null}
        </Container>
      </Body>
    </Html>,
  )

  const text = [heading, ...paragraphs, primaryCta?.href, footer?.href]
    .filter(Boolean)
    .join('\n\n')

  return { html, text }
}

export const buildEmailTemplate = async <TTemplateKey extends EmailTemplateKey>(
  key: TTemplateKey,
  payload: EmailTemplatePayload<TTemplateKey>,
): Promise<BuiltTemplate> => {
  if (key === 'auth-welcome') {
    const data = payload as EmailTemplatePayload<'auth-welcome'>
    const subject = `Welcome to ${brandConfig.companyName}`
    const { html, text } = await renderTemplate({
      preview: 'Your account is ready.',
      heading: `Welcome, ${data.name}`,
      paragraphs: [
        'Your account has been created successfully.',
        'Use your dashboard to manage profile, sessions, and editorial preferences.',
      ],
      primaryCta: { label: 'Open Dashboard', href: data.dashboardUrl },
    })
    return { subject, html, text }
  }

  if (key === 'auth-verify-email') {
    const data = payload as EmailTemplatePayload<'auth-verify-email'>
    const subject = 'Verify your email'
    const { html, text } = await renderTemplate({
      preview: 'Confirm your email address.',
      heading: `Verify your email, ${data.name}`,
      paragraphs: [
        'Please verify your email address to complete your account setup.',
      ],
      primaryCta: { label: 'Verify Email', href: data.verificationUrl },
    })
    return { subject, html, text }
  }

  if (key === 'auth-reset-password') {
    const data = payload as EmailTemplatePayload<'auth-reset-password'>
    const subject = 'Reset your password'
    const { html, text } = await renderTemplate({
      preview: 'Password reset requested.',
      heading: `Password reset requested for ${data.name}`,
      paragraphs: [
        'A request was received to reset your password.',
        'If this was not you, you can safely ignore this email.',
      ],
      primaryCta: { label: 'Reset Password', href: data.resetUrl },
    })
    return { subject, html, text }
  }

  if (key === 'security-password-changed') {
    const data = payload as EmailTemplatePayload<'security-password-changed'>
    const subject = 'Security alert: password changed'
    const { html, text } = await renderTemplate({
      preview: 'Your password was changed.',
      heading: 'Your password was updated',
      paragraphs: [
        `Time: ${data.timestamp}.`,
        'If this was not you, review your account security immediately.',
      ],
      primaryCta: { label: 'Review Security', href: data.securityUrl },
    })
    return { subject, html, text }
  }

  if (key === 'security-sessions-revoked') {
    const data = payload as EmailTemplatePayload<'security-sessions-revoked'>
    const subject = 'Security alert: sessions revoked'
    const { html, text } = await renderTemplate({
      preview: 'Account sessions were revoked.',
      heading: 'Account sessions were revoked',
      paragraphs: [
        `Time: ${data.timestamp}.`,
        'If this was not you, secure your account and change your password.',
      ],
      primaryCta: { label: 'Review Security', href: data.securityUrl },
    })
    return { subject, html, text }
  }

  if (key === 'editorial-blog-published') {
    const data = payload as EmailTemplatePayload<'editorial-blog-published'>
    const subject = `New newsroom story: ${data.title}`
    const footerLink = templateLink(data.manageUrl, data.unsubscribeUrl)

    const { html, text } = await renderTemplate({
      preview: data.title,
      heading: data.title,
      paragraphs: [
        data.excerpt ?? 'A new newsroom story has been published.',
      ],
      primaryCta: { label: 'Read Post', href: data.postUrl },
      footer: footerLink,
    })
    return { subject, html, text }
  }

  if (key === 'editorial-press-published') {
    const data = payload as EmailTemplatePayload<'editorial-press-published'>
    const subject = `New press release: ${data.title}`
    const footerLink = templateLink(data.manageUrl, data.unsubscribeUrl)

    const { html, text } = await renderTemplate({
      preview: data.title,
      heading: data.title,
      paragraphs: [
        data.summary ??
          'A new press release has been published and is now available.',
      ],
      primaryCta: { label: 'Open Press Release', href: data.releaseUrl },
      footer: footerLink,
    })
    return { subject, html, text }
  }

  if (key === 'contact-admin-notification') {
    const data = payload as EmailTemplatePayload<'contact-admin-notification'>
    const subject = `Contact submission: ${data.subject}`
    const { html, text } = await renderTemplate({
      preview: 'New contact submission',
      heading: 'New contact submission',
      paragraphs: [
        `From: ${data.name} <${data.email}>`,
        `Phone: ${data.phone}`,
        `Area/Region: ${data.suburb}`,
        `Service Interest: ${formatLeadValue(data.serviceInterest)}`,
        `Organization Profile: ${formatLeadValue(data.propertyType)}`,
        `Timeline: ${formatLeadValue(data.urgency)}`,
        `Preferred Contact: ${formatLeadValue(data.preferredContactMethod)}`,
        `Best Contact Time: ${data.bestContactTime || 'Not specified'}`,
        `Source Path: ${data.sourcePath}`,
        `Subject: ${data.subject}`,
        data.message,
      ],
    })
    return { subject, html, text }
  }

  const data = payload as EmailTemplatePayload<'contact-user-confirmation'>
  const subject = 'We received your message'
  const { html, text } = await renderTemplate({
    preview: 'Contact request received',
    heading: `Thanks, ${data.name}`,
    paragraphs: [
      'Your message was received by the team.',
      `If you need to follow up, reply to ${data.supportEmail}.`,
    ],
  })

  return { subject, html, text }
}
