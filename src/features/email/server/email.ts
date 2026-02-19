import { createHash } from 'node:crypto'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'
import { assertPermission } from '@/features/auth/server/authorize'
import { checkRateLimit } from '@/features/auth/server/rate-limit'
import { emailRepository } from '@/features/email/server/repository.server'
import { retryEmailMessage } from '@/features/email/server/send.server'
import {
  emailAdminFiltersSchema,
  retryEmailSchema,
} from '@/features/email/schemas/admin'
import { emailPreferenceUpdateSchema } from '@/features/email/schemas/preferences'
import {
  emailSubscriptionSchema,
  emailUnsubscribeTokenSchema,
} from '@/features/email/schemas/subscriptions'

const getSession = async () => {
  const { requireSession } =
    await import('@/features/auth/server/session.server')
  return requireSession()
}

const getAdminSession = async () => {
  const { requireAdmin } = await import('@/features/auth/server/session.server')
  return requireAdmin()
}

const getClientIp = (headers: Headers) =>
  headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'

const toTokenFingerprint = (token: string) =>
  createHash('sha256').update(token).digest('hex').slice(0, 16)

const adminFilterInputSchema = emailAdminFiltersSchema.partial().default({})

export const getMyEmailPreferencesFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const session = await getSession()
  assertPermission(session, 'account.update')
  return emailRepository.getOrCreateUserPreferences(session.user.id)
})

export const updateMyEmailPreferencesFn = createServerFn({ method: 'POST' })
  .inputValidator(emailPreferenceUpdateSchema)
  .handler(async ({ data }) => {
    const session = await getSession()
    assertPermission(session, 'account.update')

    const updated = await emailRepository.updateUserPreferences(
      session.user.id,
      data,
    )
    return { success: true, preferences: updated }
  })

export const subscribeToEmailTopicFn = createServerFn({ method: 'POST' })
  .inputValidator(emailSubscriptionSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()

    const rateLimit = await checkRateLimit({
      key: `email-subscribe:${headers.get('x-forwarded-for') ?? 'local'}:${data.email.toLowerCase()}`,
      limit: 8,
      windowMs: 60_000,
    })

    if (!rateLimit.allowed) {
      throw new Error(
        'Too many subscription attempts. Please wait before retrying.',
      )
    }

    const saved = await emailRepository.subscribe({
      email: data.email,
      topic: data.topic,
      source: data.source,
      userId: null,
    })

    return {
      success: true,
      subscription: {
        email: saved.email,
        topic: saved.topic,
        status: saved.status,
      },
    }
  })

export const unsubscribeByTokenFn = createServerFn({ method: 'POST' })
  .inputValidator(emailUnsubscribeTokenSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const tokenFingerprint = toTokenFingerprint(data.token)

    const rateLimit = await checkRateLimit({
      key: `email-unsubscribe:${getClientIp(headers)}:${tokenFingerprint}`,
      limit: 12,
      windowMs: 60_000,
    })

    if (!rateLimit.allowed) {
      throw new Error(
        'Too many unsubscribe attempts. Please wait before retrying.',
      )
    }

    const updated = await emailRepository.unsubscribeByToken(data.token)
    if (!updated) {
      throw new Error('Invalid unsubscribe token')
    }

    return {
      success: true,
      email: updated.email,
      topic: updated.topic,
    }
  })

export const getAdminEmailMessagesFn = createServerFn({ method: 'GET' })
  .inputValidator(adminFilterInputSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.read')

    const filters = emailAdminFiltersSchema.parse(data)
    const listing = await emailRepository.listMessages(filters)

    return {
      messages: listing.messages,
      total: listing.total,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: Math.max(1, Math.ceil(listing.total / filters.pageSize)),
      filters,
    }
  })

export const getAdminEmailOverviewFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const session = await getAdminSession()
  assertPermission(session, 'users.read')

  return emailRepository.getOverview()
})

export const retryEmailMessageFn = createServerFn({ method: 'POST' })
  .inputValidator(retryEmailSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.write')

    return retryEmailMessage(data.id)
  })

export const bulkRetryEmailsFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      ids: z.array(z.string().trim().min(1)).min(1).max(100),
    }),
  )
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.write')

    const uniqueIds = Array.from(new Set(data.ids))
    const rows = await Promise.all(
      uniqueIds.map(async (id) => {
        const message = await emailRepository.getMessageById(id)
        if (!message) return { id, state: 'missing' as const }
        if (message.status !== 'failed')
          return { id, state: 'skipped' as const }

        await retryEmailMessage(id)
        return { id, state: 'queued' as const }
      }),
    )

    return {
      total: uniqueIds.length,
      queued: rows.filter((row) => row.state === 'queued').length,
      skipped: rows.filter((row) => row.state === 'skipped').length,
      missing: rows.filter((row) => row.state === 'missing').length,
    }
  })

export const getAdminEmailMessageDetailFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      id: z.string().trim().min(1),
      limit: z.coerce.number().int().min(1).max(500).optional().default(50),
    }),
  )
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.read')

    const [message, events] = await Promise.all([
      emailRepository.getMessageById(data.id),
      emailRepository.listMessageEvents(data.id, data.limit),
    ])

    if (!message) throw new Error('Email message not found')

    return {
      message: {
        id: message.id,
        toEmail: message.toEmail,
        toUserId: message.toUserId,
        provider: message.provider,
        templateKey: message.templateKey,
        messageType: message.messageType,
        topic: message.topic,
        status: message.status,
        subject: message.subject,
        errorMessage: message.errorMessage,
        attempts: message.attempts,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        sentAt: message.sentAt,
      },
      events,
    }
  })

export const unsubscribeByTokenSearchSchema = z.object({
  token: z.string().trim().min(16),
})
