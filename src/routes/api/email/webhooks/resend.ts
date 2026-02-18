import { createFileRoute } from '@tanstack/react-router'
import { processResendWebhook } from '@/features/email/server/webhooks.server'
import { logger } from '@/lib/observability'

const webhookLogger = logger.child({
  domain: 'email-webhooks',
  provider: 'resend',
})

const MAX_WEBHOOK_BODY_BYTES = 256 * 1024

const jsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })

export const handleResendWebhookPost = async ({
  request,
}: {
  request: Request
}) => {
  const contentLengthHeader = request.headers.get('content-length')
  const contentLength = contentLengthHeader ? Number(contentLengthHeader) : NaN

  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_WEBHOOK_BODY_BYTES
  ) {
    webhookLogger.warn('email.webhook.rejected.payload-too-large', {
      contentLength,
      maxBytes: MAX_WEBHOOK_BODY_BYTES,
    })
    return jsonResponse(413, {
      ok: false,
      error: 'Payload too large',
    })
  }

  const payload = await request.text()
  const payloadBytes = Buffer.byteLength(payload, 'utf8')
  if (payloadBytes > MAX_WEBHOOK_BODY_BYTES) {
    webhookLogger.warn('email.webhook.rejected.payload-too-large', {
      payloadBytes,
      maxBytes: MAX_WEBHOOK_BODY_BYTES,
    })
    return jsonResponse(413, {
      ok: false,
      error: 'Payload too large',
    })
  }

  try {
    const result = await processResendWebhook({
      payload,
      headers: request.headers,
    })

    webhookLogger.info('email.webhook.accepted', {
      linkedMessageId: result.linkedMessageId,
      providerMessageId: result.providerMessageId,
      status: result.status,
    })

    return jsonResponse(202, {
      ok: true,
      accepted: result.accepted,
      linkedMessageId: result.linkedMessageId,
    })
  } catch (error) {
    webhookLogger.warn('email.webhook.rejected.invalid', { error })
    return jsonResponse(400, {
      ok: false,
      error: 'Invalid webhook payload or signature.',
    })
  }
}

export const Route = createFileRoute('/api/email/webhooks/resend')({
  server: {
    handlers: {
      POST: handleResendWebhookPost,
    },
  },
})
