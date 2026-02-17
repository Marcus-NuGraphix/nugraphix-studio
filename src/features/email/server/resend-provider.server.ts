import { Resend } from 'resend'
import type {
  EmailProvider,
  EmailSendRequest,
} from '@/features/email/server/provider'
import { env } from '@/lib/env/server'

const getResendClient = () => {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required when EMAIL_PROVIDER is resend')
  }

  return new Resend(env.RESEND_API_KEY)
}

export const resendEmailProvider: EmailProvider = {
  name: 'resend',
  async send(request: EmailSendRequest) {
    const resend = getResendClient()

    const response = await resend.emails.send({
      from: request.from,
      to: request.to,
      subject: request.subject,
      html: request.html,
      text: request.text,
      replyTo: request.replyTo ?? undefined,
      scheduledAt: request.scheduledAt?.toISOString(),
      tags: request.tags,
      headers: request.idempotencyKey
        ? {
            'Idempotency-Key': request.idempotencyKey,
          }
        : undefined,
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return {
      providerMessageId: response.data.id,
      raw: response,
    }
  },
}
