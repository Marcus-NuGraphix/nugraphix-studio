import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm'
import type {
  EmailMessageStatus,
  EmailPreferenceFlags,
  EmailTopic,
} from '@/features/email/model/types'
import type { EmailAdminFiltersInput } from '@/features/email/schemas/admin'
import type { EmailPreferenceInput } from '@/features/email/schemas/preferences'
import { defaultUserEmailPreferences } from '@/features/email/model/types'
import { db } from '@/lib/db'
import {
  emailEvent,
  emailMessage,
  emailPreference,
  emailSubscription,
  user,
} from '@/lib/db/schema'

const toTopicEnabled = (
  topic: EmailTopic,
  preferences: EmailPreferenceFlags,
) => {
  if (topic === 'blog') {
    return preferences.editorialEnabled && preferences.blogUpdatesEnabled
  }

  if (topic === 'press') {
    return preferences.editorialEnabled && preferences.pressUpdatesEnabled
  }

  if (topic === 'product') {
    return preferences.editorialEnabled && preferences.productUpdatesEnabled
  }

  if (topic === 'security') {
    return preferences.transactionalEnabled && preferences.securityAlertsEnabled
  }

  if (topic === 'account') {
    return preferences.transactionalEnabled
  }

  return true
}

const toDefaultPreferences = () => ({
  ...defaultUserEmailPreferences,
})

const getOrCreateUserPreferences = async (userId: string) => {
  const existing = await db.query.emailPreference.findFirst({
    where: eq(emailPreference.userId, userId),
  })

  if (existing) return existing

  const [created] = await db
    .insert(emailPreference)
    .values({
      userId,
      ...toDefaultPreferences(),
    })
    .returning()

  return created
}

const updateUserPreferences = async (
  userId: string,
  values: EmailPreferenceInput,
) => {
  await getOrCreateUserPreferences(userId)

  const [updated] = await db
    .update(emailPreference)
    .set({
      transactionalEnabled: values.transactionalEnabled,
      editorialEnabled: values.editorialEnabled,
      blogUpdatesEnabled: values.blogUpdatesEnabled,
      pressUpdatesEnabled: values.pressUpdatesEnabled,
      productUpdatesEnabled: values.productUpdatesEnabled,
      securityAlertsEnabled: values.securityAlertsEnabled,
    })
    .where(eq(emailPreference.userId, userId))
    .returning()

  return updated
}

const subscribe = async ({
  email,
  topic,
  source,
  userId,
}: {
  email: string
  topic: EmailTopic
  source: string
  userId?: string | null
}) => {
  const normalizedEmail = email.trim().toLowerCase()

  const existing = await db.query.emailSubscription.findFirst({
    where: and(
      eq(emailSubscription.email, normalizedEmail),
      eq(emailSubscription.topic, topic),
    ),
  })

  const unsubscribeToken = existing?.unsubscribeToken ?? crypto.randomUUID()

  const [saved] = await db
    .insert(emailSubscription)
    .values({
      id: existing?.id ?? crypto.randomUUID(),
      userId: userId ?? existing?.userId ?? null,
      email: normalizedEmail,
      topic,
      source,
      status: 'subscribed',
      unsubscribeToken,
      unsubscribedAt: null,
    })
    .onConflictDoUpdate({
      target: [emailSubscription.email, emailSubscription.topic],
      set: {
        userId: userId ?? existing?.userId ?? null,
        status: 'subscribed',
        source,
        unsubscribeToken,
        unsubscribedAt: null,
      },
    })
    .returning()

  return saved
}

const unsubscribeByToken = async (
  token: string,
): Promise<typeof emailSubscription.$inferSelect | null> => {
  const rows = await db
    .update(emailSubscription)
    .set({
      status: 'unsubscribed',
      unsubscribedAt: new Date(),
    })
    .where(eq(emailSubscription.unsubscribeToken, token))
    .returning()

  return rows[0] ?? null
}

const listSubscriptionRecipients = async (topic: EmailTopic) => {
  const rows = await db
    .select({
      email: emailSubscription.email,
      unsubscribeToken: emailSubscription.unsubscribeToken,
      userId: emailSubscription.userId,
    })
    .from(emailSubscription)
    .where(
      and(
        eq(emailSubscription.topic, topic),
        eq(emailSubscription.status, 'subscribed'),
      ),
    )

  return rows
}

const listUserRecipients = async (topic: EmailTopic) => {
  const rows = await db
    .select({
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      status: user.status,
      preference: {
        transactionalEnabled: emailPreference.transactionalEnabled,
        editorialEnabled: emailPreference.editorialEnabled,
        blogUpdatesEnabled: emailPreference.blogUpdatesEnabled,
        pressUpdatesEnabled: emailPreference.pressUpdatesEnabled,
        productUpdatesEnabled: emailPreference.productUpdatesEnabled,
        securityAlertsEnabled: emailPreference.securityAlertsEnabled,
      },
    })
    .from(user)
    .leftJoin(emailPreference, eq(emailPreference.userId, user.id))
    .where(eq(user.status, 'active'))

  return rows
    .filter((row) => {
      if (topic === 'blog' || topic === 'press' || topic === 'product') {
        if (!row.emailVerified) return false
      }

      const rawPreference = row.preference
      const prefs = {
        ...toDefaultPreferences(),
        ...(rawPreference === null
          ? {}
          : {
              transactionalEnabled: rawPreference.transactionalEnabled,
              editorialEnabled: rawPreference.editorialEnabled,
              blogUpdatesEnabled: rawPreference.blogUpdatesEnabled,
              pressUpdatesEnabled: rawPreference.pressUpdatesEnabled,
              productUpdatesEnabled: rawPreference.productUpdatesEnabled,
              securityAlertsEnabled: rawPreference.securityAlertsEnabled,
            }),
      }

      return toTopicEnabled(topic, prefs)
    })
    .map((row) => ({
      email: row.email,
      userId: row.id,
      unsubscribeToken: null,
    }))
}

const listEditorialRecipients = async (
  topic: Extract<EmailTopic, 'blog' | 'press' | 'product'>,
) => {
  const [subscriptionRecipients, userRecipients] = await Promise.all([
    listSubscriptionRecipients(topic),
    listUserRecipients(topic),
  ])

  const byEmail = new Map<
    string,
    { email: string; userId: string | null; unsubscribeToken: string | null }
  >()

  for (const row of userRecipients) {
    byEmail.set(row.email, {
      email: row.email,
      userId: row.userId,
      unsubscribeToken: row.unsubscribeToken,
    })
  }

  for (const row of subscriptionRecipients) {
    const existing = byEmail.get(row.email)
    byEmail.set(row.email, {
      email: row.email,
      userId: existing?.userId ?? row.userId,
      unsubscribeToken: row.unsubscribeToken,
    })
  }

  return Array.from(byEmail.values())
}

const findMessageByIdempotencyKey = async (idempotencyKey: string) =>
  db.query.emailMessage.findFirst({
    where: eq(emailMessage.idempotencyKey, idempotencyKey),
  })

const createMessage = async (values: typeof emailMessage.$inferInsert) => {
  const [created] = await db.insert(emailMessage).values(values).returning()
  return created
}

const getMessageById = async (id: string) =>
  db.query.emailMessage.findFirst({ where: eq(emailMessage.id, id) })

const listMessageEvents = async (messageId: string, limit = 100) =>
  db
    .select({
      id: emailEvent.id,
      type: emailEvent.type,
      providerEventId: emailEvent.providerEventId,
      email: emailEvent.email,
      occurredAt: emailEvent.occurredAt,
      createdAt: emailEvent.createdAt,
    })
    .from(emailEvent)
    .where(eq(emailEvent.messageId, messageId))
    .orderBy(desc(emailEvent.occurredAt))
    .limit(limit)

const findMessageByProviderId = async (providerMessageId: string) =>
  db.query.emailMessage.findFirst({
    where: eq(emailMessage.providerMessageId, providerMessageId),
  })

const incrementAttempts = async (id: string) =>
  db
    .update(emailMessage)
    .set({
      attempts: sql`${emailMessage.attempts} + 1`,
      errorMessage: null,
      status: 'queued',
    })
    .where(eq(emailMessage.id, id))

const markMessageSent = async ({
  id,
  providerMessageId,
}: {
  id: string
  providerMessageId: string | null
}) => {
  const [updated] = await db
    .update(emailMessage)
    .set({
      status: 'sent',
      providerMessageId,
      sentAt: new Date(),
      errorMessage: null,
    })
    .where(eq(emailMessage.id, id))
    .returning()

  return updated
}

const markMessageFailed = async ({
  id,
  errorMessage,
}: {
  id: string
  errorMessage: string
}) => {
  const [updated] = await db
    .update(emailMessage)
    .set({
      status: 'failed',
      errorMessage,
    })
    .where(eq(emailMessage.id, id))
    .returning()

  return updated
}

const updateMessageStatusByProviderId = async ({
  providerMessageId,
  status,
}: {
  providerMessageId: string
  status: EmailMessageStatus
}) => {
  const [updated] = await db
    .update(emailMessage)
    .set({
      status,
    })
    .where(eq(emailMessage.providerMessageId, providerMessageId))
    .returning()

  return updated
}

const createEvent = async (
  values: typeof emailEvent.$inferInsert,
): Promise<typeof emailEvent.$inferSelect | null> => {
  const rows = await db
    .insert(emailEvent)
    .values(values)
    .onConflictDoNothing()
    .returning()

  return rows[0] ?? null
}

const listMessages = async (filters: EmailAdminFiltersInput) => {
  const whereConditions = []

  if (filters.query) {
    const query = `%${filters.query}%`
    whereConditions.push(
      or(
        ilike(emailMessage.toEmail, query),
        ilike(emailMessage.subject, query),
        ilike(emailMessage.templateKey, query),
      )!,
    )
  }

  if (filters.status) {
    whereConditions.push(eq(emailMessage.status, filters.status))
  }

  if (filters.topic) {
    whereConditions.push(eq(emailMessage.topic, filters.topic))
  }

  const where = whereConditions.length ? and(...whereConditions) : undefined
  const offset = (filters.page - 1) * filters.pageSize

  const [rows, [countRow]] = await Promise.all([
    db
      .select({
        id: emailMessage.id,
        toEmail: emailMessage.toEmail,
        toUserId: emailMessage.toUserId,
        provider: emailMessage.provider,
        templateKey: emailMessage.templateKey,
        messageType: emailMessage.messageType,
        topic: emailMessage.topic,
        status: emailMessage.status,
        subject: emailMessage.subject,
        errorMessage: emailMessage.errorMessage,
        attempts: emailMessage.attempts,
        createdAt: emailMessage.createdAt,
        updatedAt: emailMessage.updatedAt,
        sentAt: emailMessage.sentAt,
      })
      .from(emailMessage)
      .where(where)
      .orderBy(desc(emailMessage.createdAt), asc(emailMessage.toEmail))
      .limit(filters.pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(emailMessage)
      .where(where),
  ])

  return {
    messages: rows,
    total: Number(countRow.count),
  }
}

const getOverview = async () => {
  const [
    [total],
    [sent],
    [delivered],
    [opened],
    [clicked],
    [failed],
    [bounced],
    [queued],
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(emailMessage),
    db
      .select({ count: sql<number>`count(*)` })
      .from(emailMessage)
      .where(eq(emailMessage.status, 'sent')),
    db
      .select({ count: sql<number>`count(*)` })
      .from(emailMessage)
      .where(eq(emailMessage.status, 'delivered')),
    db
      .select({ count: sql<number>`count(*)` })
      .from(emailMessage)
      .where(eq(emailMessage.status, 'opened')),
    db
      .select({ count: sql<number>`count(*)` })
      .from(emailMessage)
      .where(eq(emailMessage.status, 'clicked')),
    db
      .select({ count: sql<number>`count(*)` })
      .from(emailMessage)
      .where(eq(emailMessage.status, 'failed')),
    db
      .select({ count: sql<number>`count(*)` })
      .from(emailMessage)
      .where(eq(emailMessage.status, 'bounced')),
    db
      .select({ count: sql<number>`count(*)` })
      .from(emailMessage)
      .where(eq(emailMessage.status, 'queued')),
  ])

  return {
    total: Number(total.count),
    sent: Number(sent.count),
    delivered: Number(delivered.count),
    opened: Number(opened.count),
    clicked: Number(clicked.count),
    failed: Number(failed.count),
    bounced: Number(bounced.count),
    queued: Number(queued.count),
  }
}

export const emailRepository = {
  createEvent,
  createMessage,
  findMessageByIdempotencyKey,
  findMessageByProviderId,
  getMessageById,
  listMessageEvents,
  getOrCreateUserPreferences,
  getOverview,
  incrementAttempts,
  listEditorialRecipients,
  listMessages,
  listSubscriptionRecipients,
  listUserRecipients,
  markMessageFailed,
  markMessageSent,
  subscribe,
  unsubscribeByToken,
  updateMessageStatusByProviderId,
  updateUserPreferences,
}
