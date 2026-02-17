import { and, asc, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm'
import type { UserRole } from '@/features/auth/model/session'
import type { UserAdminFiltersInput } from '@/features/users/model/filters'
import { db } from '@/lib/db'
import {
  session,
  user,
  userAuditEvent,
  userSecurityEvent,
} from '@/lib/db/schema'

const toWhereClause = (filters: UserAdminFiltersInput) => {
  const conditions = []

  if (filters.query) {
    conditions.push(
      or(
        ilike(user.name, `%${filters.query}%`),
        ilike(user.email, `%${filters.query}%`),
      ),
    )
  }

  if (filters.role) conditions.push(eq(user.role, filters.role))
  if (filters.status) conditions.push(eq(user.status, filters.status))
  if (filters.emailVerified !== undefined)
    conditions.push(eq(user.emailVerified, filters.emailVerified))
  if (filters.fromDate)
    conditions.push(gte(user.createdAt, new Date(filters.fromDate)))
  if (filters.toDate)
    conditions.push(lte(user.createdAt, new Date(filters.toDate)))

  if (conditions.length === 0) return undefined
  return and(...conditions)
}

const toOrderBy = (sort: UserAdminFiltersInput['sort']) => {
  if (sort === 'created-asc') return asc(user.createdAt)
  if (sort === 'name-asc') return asc(user.name)
  if (sort === 'name-desc') return desc(user.name)
  return desc(user.createdAt)
}

const listUsers = async (filters: UserAdminFiltersInput) => {
  const whereClause = toWhereClause(filters)
  const offset = (filters.page - 1) * filters.pageSize

  const [users, [totalRow]] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        suspendedAt: user.suspendedAt,
        suspendedReason: user.suspendedReason,
      })
      .from(user)
      .where(whereClause)
      .orderBy(toOrderBy(filters.sort))
      .limit(filters.pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(whereClause),
  ])

  return {
    users,
    total: Number(totalRow.count),
  }
}

const findUserById = (id: string) =>
  db.query.user.findFirst({
    where: eq(user.id, id),
  })

const listUserSessions = (userId: string) =>
  db
    .select({
      id: session.id,
      token: session.token,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    })
    .from(session)
    .where(eq(session.userId, userId))
    .orderBy(desc(session.createdAt))

const listAuditEventsForUser = (userId: string, limit = 100) =>
  db
    .select({
      id: userAuditEvent.id,
      action: userAuditEvent.action,
      actorUserId: userAuditEvent.actorUserId,
      actorEmail: userAuditEvent.actorEmail,
      targetUserId: userAuditEvent.targetUserId,
      targetEmail: userAuditEvent.targetEmail,
      metadata: userAuditEvent.metadata,
      createdAt: userAuditEvent.createdAt,
    })
    .from(userAuditEvent)
    .where(
      or(
        eq(userAuditEvent.targetUserId, userId),
        eq(userAuditEvent.actorUserId, userId),
      ),
    )
    .orderBy(desc(userAuditEvent.createdAt))
    .limit(limit)

const listAdminUserSessions = (limit = 200) =>
  db
    .select({
      id: session.id,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      userStatus: user.status,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    })
    .from(session)
    .innerJoin(user, eq(user.id, session.userId))
    .where(gte(session.expiresAt, new Date()))
    .orderBy(desc(session.createdAt))
    .limit(limit)

const listAdminAuditEvents = (limit = 200) =>
  db
    .select({
      id: userAuditEvent.id,
      action: userAuditEvent.action,
      actorUserId: userAuditEvent.actorUserId,
      actorEmail: userAuditEvent.actorEmail,
      targetUserId: userAuditEvent.targetUserId,
      targetEmail: userAuditEvent.targetEmail,
      metadata: userAuditEvent.metadata,
      createdAt: userAuditEvent.createdAt,
    })
    .from(userAuditEvent)
    .orderBy(desc(userAuditEvent.createdAt))
    .limit(limit)

const listSecurityEventsForUser = (userId: string, limit = 100) =>
  db
    .select({
      id: userSecurityEvent.id,
      type: userSecurityEvent.type,
      ipAddress: userSecurityEvent.ipAddress,
      userAgent: userSecurityEvent.userAgent,
      metadata: userSecurityEvent.metadata,
      createdAt: userSecurityEvent.createdAt,
    })
    .from(userSecurityEvent)
    .where(eq(userSecurityEvent.userId, userId))
    .orderBy(desc(userSecurityEvent.createdAt))
    .limit(limit)

const updateUserRole = (id: string, role: UserRole) =>
  db.update(user).set({ role }).where(eq(user.id, id))

const suspendUser = (id: string, reason: string) =>
  db
    .update(user)
    .set({
      status: 'suspended',
      banned: true,
      banReason: reason,
      suspendedReason: reason,
      suspendedAt: new Date(),
    })
    .where(eq(user.id, id))

const reactivateUser = (id: string) =>
  db
    .update(user)
    .set({
      status: 'active',
      banned: false,
      banReason: null,
      banExpires: null,
      suspendedReason: null,
      suspendedAt: null,
    })
    .where(eq(user.id, id))

const deleteUser = (id: string) => db.delete(user).where(eq(user.id, id))

const revokeSessionByToken = (token: string) =>
  db.delete(session).where(eq(session.token, token))

const revokeUserSessions = (userId: string) =>
  db.delete(session).where(eq(session.userId, userId))

const updateOwnProfile = ({
  id,
  name,
  image,
}: {
  id: string
  name: string
  image: string | null
}) =>
  db
    .update(user)
    .set({
      name,
      image,
    })
    .where(eq(user.id, id))

const createAuditEvent = ({
  action,
  actorUserId,
  actorEmail,
  targetUserId,
  targetEmail,
  metadata,
}: {
  action: (typeof userAuditEvent.$inferInsert)['action']
  actorUserId?: string | null
  actorEmail?: string | null
  targetUserId?: string | null
  targetEmail: string
  metadata?: Record<string, string | number | boolean | null>
}) =>
  db.insert(userAuditEvent).values({
    id: crypto.randomUUID(),
    action,
    actorUserId: actorUserId ?? null,
    actorEmail: actorEmail ?? null,
    targetUserId: targetUserId ?? null,
    targetEmail,
    metadata: metadata ?? {},
  })

const createSecurityEvent = ({
  userId,
  type,
  ipAddress,
  userAgent,
  metadata,
}: {
  userId?: string | null
  type: (typeof userSecurityEvent.$inferInsert)['type']
  ipAddress?: string | null
  userAgent?: string | null
  metadata?: Record<string, string | number | boolean | null>
}) =>
  db.insert(userSecurityEvent).values({
    id: crypto.randomUUID(),
    userId: userId ?? null,
    type,
    ipAddress: ipAddress ?? null,
    userAgent: userAgent ?? null,
    metadata: metadata ?? {},
  })

export const usersRepository = {
  createAuditEvent,
  createSecurityEvent,
  deleteUser,
  findUserById,
  listAuditEventsForUser,
  listAdminAuditEvents,
  listAdminUserSessions,
  listSecurityEventsForUser,
  listUserSessions,
  listUsers,
  reactivateUser,
  revokeSessionByToken,
  revokeUserSessions,
  suspendUser,
  updateOwnProfile,
  updateUserRole,
}
