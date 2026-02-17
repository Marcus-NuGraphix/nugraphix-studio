import type {
  EmailMessageType,
  EmailTemplateKey,
  EmailTopic,
} from '@/features/email/model/types'
import type { EmailTemplatePayload } from '@/features/email/server/templates.server'
import { getEmailProvider } from '@/features/email/server/provider-registry.server'
import { emailRepository } from '@/features/email/server/repository.server'
import { buildEmailTemplate } from '@/features/email/server/templates.server'
import { env } from '@/lib/env/server'
import { logger } from '@/lib/server'
import {
  backgroundTasks,
  registerBackgroundTaskHandler,
} from '@/lib/server/background-tasks'

const emailLogger = logger.child({ domain: 'email' })

const getDefaultFromAddress = () => env.EMAIL_FROM_ADDRESS

const getDefaultReplyTo = () => env.EMAIL_REPLY_TO ?? null

export const queueTemplatedEmail = async <
  TTemplateKey extends EmailTemplateKey,
>({
  toEmail,
  toUserId,
  templateKey,
  templateData,
  messageType,
  topic,
  metadata,
  correlationKey,
  idempotencyKey,
  scheduledAt,
}: {
  toEmail: string
  toUserId?: string | null
  templateKey: TTemplateKey
  templateData: EmailTemplatePayload<TTemplateKey>
  messageType: EmailMessageType
  topic: EmailTopic
  metadata?: Record<string, string | number | boolean | null>
  correlationKey?: string | null
  idempotencyKey?: string | null
  scheduledAt?: Date | null
}) => {
  if (idempotencyKey) {
    const existing =
      await emailRepository.findMessageByIdempotencyKey(idempotencyKey)

    if (existing) {
      return existing
    }
  }

  const provider = getEmailProvider()
  const rendered = await buildEmailTemplate(templateKey, templateData)

  const message = await emailRepository.createMessage({
    id: crypto.randomUUID(),
    toEmail: toEmail.trim().toLowerCase(),
    toUserId: toUserId ?? null,
    provider: provider.name,
    templateKey,
    messageType,
    topic,
    status: 'queued',
    subject: rendered.subject,
    fromEmail: getDefaultFromAddress(),
    replyTo: getDefaultReplyTo(),
    html: rendered.html,
    textBody: rendered.text,
    correlationKey: correlationKey ?? null,
    idempotencyKey: idempotencyKey ?? null,
    scheduledAt: scheduledAt ?? null,
    payload: templateData,
    metadata: metadata ?? {},
  })

  await backgroundTasks.enqueue({
    name: 'email.send',
    payload: { messageId: message.id },
    runAt: scheduledAt ?? undefined,
  })

  return message
}

export const queueBulkTemplatedEmail = async <
  TTemplateKey extends EmailTemplateKey,
>({
  recipients,
  templateKey,
  messageType,
  topic,
  makePayload,
  correlationKey,
}: {
  recipients: Array<{
    email: string
    userId?: string | null
    unsubscribeToken?: string | null
  }>
  templateKey: TTemplateKey
  messageType: EmailMessageType
  topic: EmailTopic
  makePayload: (
    recipient: {
      email: string
      userId?: string | null
      unsubscribeToken?: string | null
    },
    index: number,
  ) => EmailTemplatePayload<TTemplateKey>
  correlationKey?: string | null
}) => {
  const tasks = recipients.map((recipient, index) =>
    queueTemplatedEmail({
      toEmail: recipient.email,
      toUserId: recipient.userId ?? null,
      templateKey,
      templateData: makePayload(recipient, index),
      messageType,
      topic,
      correlationKey,
      idempotencyKey: `${topic}:${templateKey}:${recipient.email}:${correlationKey ?? index}`,
    }),
  )

  const results = await Promise.allSettled(tasks)

  return {
    queued: results.filter((result) => result.status === 'fulfilled').length,
    failed: results.filter((result) => result.status === 'rejected').length,
  }
}

export const processQueuedEmailTask = async ({
  messageId,
}: {
  messageId: string
}) => {
  const message = await emailRepository.getMessageById(messageId)

  if (!message) {
    emailLogger.warn('email.message.missing', { messageId })
    return { processed: false, reason: 'not-found' as const }
  }

  if (message.status !== 'queued' && message.status !== 'failed') {
    return { processed: false, reason: 'already-processed' as const }
  }

  await emailRepository.incrementAttempts(message.id)

  try {
    const provider = getEmailProvider()
    const result = await provider.send({
      to: message.toEmail,
      subject: message.subject,
      html: message.html,
      text: message.textBody,
      from: message.fromEmail,
      replyTo: message.replyTo,
      idempotencyKey: message.idempotencyKey,
      scheduledAt: message.scheduledAt,
      tags: message.topic
        ? [
            {
              name: 'topic',
              value: message.topic,
            },
          ]
        : undefined,
    })

    const updated = await emailRepository.markMessageSent({
      id: message.id,
      providerMessageId: result.providerMessageId,
    })

    await emailRepository.createEvent({
      id: crypto.randomUUID(),
      messageId: message.id,
      type: 'email.sent',
      providerEventId: null,
      email: message.toEmail,
      occurredAt: new Date(),
      payload: {
        providerMessageId: result.providerMessageId,
      },
    })

    return { processed: true, message: updated }
  } catch (error) {
    const messageText =
      error instanceof Error ? error.message : 'Unknown email provider error'

    const updated = await emailRepository.markMessageFailed({
      id: message.id,
      errorMessage: messageText,
    })

    await emailRepository.createEvent({
      id: crypto.randomUUID(),
      messageId: message.id,
      type: 'email.failed',
      providerEventId: null,
      email: message.toEmail,
      occurredAt: new Date(),
      payload: {
        error: messageText,
      },
    })

    emailLogger.error('email.send.failed', {
      messageId: message.id,
      error,
    })

    return { processed: true, message: updated }
  }
}

export const retryEmailMessage = async (messageId: string) => {
  const message = await emailRepository.getMessageById(messageId)
  if (!message) throw new Error('Email message not found')

  if (message.status !== 'failed') {
    throw new Error('Only failed email messages can be retried')
  }

  await backgroundTasks.enqueue({
    name: 'email.send',
    payload: { messageId: message.id },
  })

  return { queued: true }
}

registerBackgroundTaskHandler('email.send', async (payload) => {
  const parsed = payload as { messageId?: string }

  if (!parsed.messageId) {
    throw new Error('email.send task missing messageId')
  }

  await processQueuedEmailTask({ messageId: parsed.messageId })
})
