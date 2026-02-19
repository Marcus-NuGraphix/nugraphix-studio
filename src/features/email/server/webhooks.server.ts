import { Resend } from 'resend'
import type { EmailMessageStatus } from '@/features/email/model/types'
import { resendWebhookEnvelopeSchema } from '@/features/email/schemas/webhooks'
import { emailRepository } from '@/features/email/server/repository.server'
import { env } from '@/lib/env/server'

const supportedWebhookTypes = [
  'email.sent',
  'email.scheduled',
  'email.delivered',
  'email.delivery_delayed',
  'email.complained',
  'email.bounced',
  'email.opened',
  'email.clicked',
  'email.failed',
  'email.suppressed',
] as const

type SupportedWebhookType = (typeof supportedWebhookTypes)[number]

const isSupportedWebhookType = (value: string): value is SupportedWebhookType =>
  supportedWebhookTypes.includes(value as SupportedWebhookType)

const statusByWebhookType: Partial<
  Record<SupportedWebhookType, EmailMessageStatus>
> = {
  'email.sent': 'sent',
  'email.delivered': 'delivered',
  'email.bounced': 'bounced',
  'email.complained': 'complained',
  'email.opened': 'opened',
  'email.clicked': 'clicked',
  'email.suppressed': 'suppressed',
  'email.failed': 'failed',
}

const toProviderMessageId = (payload: Record<string, unknown>) => {
  const data = payload.data
  if (!data || typeof data !== 'object') return null

  const record = data as Record<string, unknown>
  const messageId =
    record.email_id ?? record.emailId ?? record.id ?? record.message_id

  return typeof messageId === 'string' ? messageId : null
}

const toProviderEventId = (payload: Record<string, unknown>) => {
  const data = payload.data
  if (!data || typeof data !== 'object') return null

  const record = data as Record<string, unknown>
  const eventId = record.id
  return typeof eventId === 'string' ? eventId : null
}

const toEventEmail = (payload: Record<string, unknown>) => {
  const data = payload.data
  if (!data || typeof data !== 'object') return null

  const record = data as Record<string, unknown>
  const email = record.to ?? record.email
  return typeof email === 'string' ? email : null
}

const parsePayload = ({
  payload,
  headers,
}: {
  payload: string
  headers: globalThis.Headers
}) => {
  const isProduction = process.env.NODE_ENV === 'production'

  if (
    env.EMAIL_PROVIDER === 'resend' &&
    isProduction &&
    !env.RESEND_WEBHOOK_SECRET
  ) {
    throw new Error(
      'RESEND_WEBHOOK_SECRET is required for resend webhooks in production.',
    )
  }

  if (env.RESEND_WEBHOOK_SECRET) {
    const id = headers.get('svix-id')
    const timestamp = headers.get('svix-timestamp')
    const signature = headers.get('svix-signature')

    if (!id || !timestamp || !signature) {
      throw new Error('Missing required webhook signature headers')
    }

    const resend = new Resend(env.RESEND_API_KEY)
    return resend.webhooks.verify({
      payload,
      headers: {
        id,
        timestamp,
        signature,
      },
      webhookSecret: env.RESEND_WEBHOOK_SECRET,
    }) as unknown as Record<string, unknown>
  }

  return JSON.parse(payload) as Record<string, unknown>
}

export const processResendWebhook = async ({
  payload,
  headers,
}: {
  payload: string
  headers: globalThis.Headers
}) => {
  const parsed = parsePayload({ payload, headers })
  const envelope = resendWebhookEnvelopeSchema.parse(parsed)

  if (!isSupportedWebhookType(envelope.type)) {
    return {
      accepted: true,
      linkedMessageId: null,
      providerMessageId: null,
      status: undefined,
    }
  }

  const providerMessageId = toProviderMessageId(parsed)
  const providerEventId = toProviderEventId(parsed)
  const email = toEventEmail(parsed)
  const status = statusByWebhookType[envelope.type]

  let linkedMessageId: string | null = null

  if (providerMessageId && status) {
    const updated = await emailRepository.updateMessageStatusByProviderId({
      providerMessageId,
      status,
    })

    linkedMessageId = updated.id
  }

  await emailRepository.createEvent({
    id: crypto.randomUUID(),
    messageId: linkedMessageId,
    type: envelope.type,
    providerEventId,
    email,
    occurredAt: envelope.created_at
      ? new Date(envelope.created_at)
      : new Date(),
    payload: parsed,
  })

  return {
    accepted: true,
    linkedMessageId,
    providerMessageId,
    status,
  }
}
