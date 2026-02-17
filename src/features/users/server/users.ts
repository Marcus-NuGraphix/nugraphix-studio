import { getRequestHeaders } from '@tanstack/react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { assertPermission } from '@/features/auth/server/authorize'
import {
  changePasswordForCurrentUser,
  listCurrentUserSessions,
  revokeAllCurrentUserSessions,
  revokeCurrentUserSession,
} from '@/features/auth/server/security'
import {
  sendPasswordChangedEmail,
  sendSessionsRevokedEmail,
} from '@/features/email/server/workflows.server'
import { roleValues } from '@/features/auth/model/session'
import { userAdminFiltersSchema } from '@/features/users/model/filters'
import { usersRepository } from '@/features/users/server/repository'
import {
  reactivateUserSchema,
  revokeUserSessionsSchema,
  setUserRoleSchema,
  suspendUserSchema,
  userIdSchema,
} from '@/features/users/schemas/user-admin'
import {
  changePasswordSchema,
  revokeSessionSchema,
  updateProfileSchema,
} from '@/features/users/schemas/user-account'
import { auth } from '@/features/auth/server/auth'
import { logger } from '@/features/shared/lib/logger.server'

const usersLogger = logger.child({ domain: 'users' })

const getAdminSession = async () => {
  const { requireAdmin } = await import('@/features/auth/server/session.server')
  return requireAdmin()
}

const getSession = async () => {
  const { requireSession } =
    await import('@/features/auth/server/session.server')
  return requireSession()
}

const adminFilterInputSchema = userAdminFiltersSchema.partial().default({})
const adminCollectionInputSchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(500).optional(),
  })
  .default({})

export const getUsersFn = createServerFn({ method: 'GET' })
  .inputValidator(adminFilterInputSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.read')
    const filters = userAdminFiltersSchema.parse(data)
    const result = await usersRepository.listUsers(filters)

    return {
      users: result.users,
      total: result.total,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: Math.max(1, Math.ceil(result.total / filters.pageSize)),
      filters,
    }
  })

export const getAdminUserSessionsFn = createServerFn({ method: 'GET' })
  .inputValidator(adminCollectionInputSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.read')

    const input = adminCollectionInputSchema.parse(data)
    return usersRepository.listAdminUserSessions(input.limit ?? 200)
  })

export const getAdminAuditEventsFn = createServerFn({ method: 'GET' })
  .inputValidator(adminCollectionInputSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.read')

    const input = adminCollectionInputSchema.parse(data)
    return usersRepository.listAdminAuditEvents(input.limit ?? 200)
  })

export const getUserDetailFn = createServerFn({ method: 'GET' })
  .inputValidator(userIdSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.read')

    const [target, sessions, auditEvents, securityEvents] = await Promise.all([
      usersRepository.findUserById(data.id),
      usersRepository.listUserSessions(data.id),
      usersRepository.listAuditEventsForUser(data.id),
      usersRepository.listSecurityEventsForUser(data.id),
    ])

    if (!target) throw new Error('User not found')

    return {
      user: target,
      sessions,
      auditEvents,
      securityEvents,
    }
  })

export const setUserRoleFn = createServerFn({ method: 'POST' })
  .inputValidator(setUserRoleSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.write')

    if (session.user.id === data.id && data.role !== 'admin') {
      throw new Error('You cannot remove your own admin role')
    }

    const target = await usersRepository.findUserById(data.id)
    if (!target) throw new Error('User not found')

    await usersRepository.updateUserRole(data.id, data.role)
    await usersRepository.createAuditEvent({
      action: 'role-updated',
      actorUserId: session.user.id,
      actorEmail: session.user.email,
      targetUserId: target.id,
      targetEmail: target.email,
      metadata: { role: data.role },
    })

    usersLogger.info('users.role.updated', { userId: data.id, role: data.role })
    return { success: true }
  })

export const suspendUserFn = createServerFn({ method: 'POST' })
  .inputValidator(suspendUserSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.write')

    if (session.user.id === data.id) {
      throw new Error('You cannot suspend your own account')
    }

    const target = await usersRepository.findUserById(data.id)
    if (!target) throw new Error('User not found')

    await usersRepository.suspendUser(data.id, data.reason)
    await usersRepository.createAuditEvent({
      action: 'status-suspended',
      actorUserId: session.user.id,
      actorEmail: session.user.email,
      targetUserId: target.id,
      targetEmail: target.email,
      metadata: { reason: data.reason },
    })

    usersLogger.warn('users.status.suspended', {
      userId: data.id,
      reason: data.reason,
    })
    return { success: true }
  })

export const reactivateUserFn = createServerFn({ method: 'POST' })
  .inputValidator(reactivateUserSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.write')

    const target = await usersRepository.findUserById(data.id)
    if (!target) throw new Error('User not found')

    await usersRepository.reactivateUser(data.id)
    await usersRepository.createAuditEvent({
      action: 'status-reactivated',
      actorUserId: session.user.id,
      actorEmail: session.user.email,
      targetUserId: target.id,
      targetEmail: target.email,
    })

    usersLogger.info('users.status.reactivated', { userId: data.id })
    return { success: true }
  })

export const revokeUserSessionsFn = createServerFn({ method: 'POST' })
  .inputValidator(revokeUserSessionsSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.sessions.revoke')

    const target = await usersRepository.findUserById(data.id)
    if (!target) throw new Error('User not found')

    await usersRepository.revokeUserSessions(data.id)
    await usersRepository.createAuditEvent({
      action: 'sessions-revoked',
      actorUserId: session.user.id,
      actorEmail: session.user.email,
      targetUserId: target.id,
      targetEmail: target.email,
      metadata: { scope: 'all' },
    })

    usersLogger.warn('users.sessions.revoked', { userId: data.id })

    void sendSessionsRevokedEmail({
      user: {
        id: target.id,
        email: target.email,
        name: target.name,
      },
      timestamp: new Date().toISOString(),
    })

    return { success: true }
  })

export const deleteUserFn = createServerFn({ method: 'POST' })
  .inputValidator(userIdSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.delete')

    if (session.user.id === data.id) {
      throw new Error('Cannot delete your own account')
    }

    const target = await usersRepository.findUserById(data.id)
    if (!target) throw new Error('User not found')

    await usersRepository.createAuditEvent({
      action: 'account-deleted',
      actorUserId: session.user.id,
      actorEmail: session.user.email,
      targetUserId: target.id,
      targetEmail: target.email,
    })
    await usersRepository.deleteUser(data.id)

    usersLogger.warn('users.account.deleted', { userId: data.id })
    return { success: true }
  })

export const getMyAccountFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSession()
    assertPermission(session, 'account.update')

    const [profile, sessions, securityEvents] = await Promise.all([
      usersRepository.findUserById(session.user.id),
      listCurrentUserSessions(),
      usersRepository.listSecurityEventsForUser(session.user.id),
    ])

    if (!profile) throw new Error('User not found')

    return { profile, sessions, securityEvents }
  },
)

export const updateMyProfileFn = createServerFn({ method: 'POST' })
  .inputValidator(updateProfileSchema)
  .handler(async ({ data }) => {
    const session = await getSession()
    assertPermission(session, 'account.update')

    await usersRepository.updateOwnProfile({
      id: session.user.id,
      name: data.name,
      image: data.image ?? null,
    })
    await usersRepository.createAuditEvent({
      action: 'profile-updated',
      actorUserId: session.user.id,
      actorEmail: session.user.email,
      targetUserId: session.user.id,
      targetEmail: session.user.email,
    })

    usersLogger.info('users.profile.updated', { userId: session.user.id })
    return { success: true }
  })

export const changeMyPasswordFn = createServerFn({ method: 'POST' })
  .inputValidator(changePasswordSchema)
  .handler(async ({ data }) => {
    const session = await getSession()
    assertPermission(session, 'account.security.manage')

    await changePasswordForCurrentUser({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      revokeOtherSessions: data.revokeOtherSessions,
    })

    const headers = getRequestHeaders()
    await Promise.all([
      usersRepository.createAuditEvent({
        action: 'password-changed',
        actorUserId: session.user.id,
        actorEmail: session.user.email,
        targetUserId: session.user.id,
        targetEmail: session.user.email,
      }),
      usersRepository.createSecurityEvent({
        userId: session.user.id,
        type: 'password-changed',
        ipAddress: headers.get('x-forwarded-for'),
        userAgent: headers.get('user-agent'),
      }),
    ])

    usersLogger.warn('users.password.changed', { userId: session.user.id })

    void sendPasswordChangedEmail({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      timestamp: new Date().toISOString(),
    })

    return { success: true }
  })

export const revokeMySessionFn = createServerFn({ method: 'POST' })
  .inputValidator(revokeSessionSchema)
  .handler(async ({ data }) => {
    const session = await getSession()
    assertPermission(session, 'account.security.manage')

    await revokeCurrentUserSession(data.token)

    const headers = getRequestHeaders()
    await usersRepository.createSecurityEvent({
      userId: session.user.id,
      type: 'session-revoked',
      ipAddress: headers.get('x-forwarded-for'),
      userAgent: headers.get('user-agent'),
      metadata: { token: data.token },
    })

    return { success: true }
  })

export const revokeAllMySessionsFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ revoke: z.literal(true) }))
  .handler(async () => {
    const session = await getSession()
    assertPermission(session, 'account.security.manage')

    await revokeAllCurrentUserSessions()

    const headers = getRequestHeaders()
    await Promise.all([
      usersRepository.createAuditEvent({
        action: 'sessions-revoked',
        actorUserId: session.user.id,
        actorEmail: session.user.email,
        targetUserId: session.user.id,
        targetEmail: session.user.email,
        metadata: { scope: 'self-all' },
      }),
      usersRepository.createSecurityEvent({
        userId: session.user.id,
        type: 'sessions-revoked',
        ipAddress: headers.get('x-forwarded-for'),
        userAgent: headers.get('user-agent'),
      }),
    ])

    void sendSessionsRevokedEmail({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      timestamp: new Date().toISOString(),
    })

    return { success: true }
  })

export const createUserFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      name: z.string().trim().min(2).max(80),
      email: z.email(),
      password: z.string().min(10),
      role: z.enum(roleValues).default('user'),
    }),
  )
  .handler(async ({ data }) => {
    const session = await getAdminSession()
    assertPermission(session, 'users.write')

    const headers = getRequestHeaders()
    const result = await auth.api.createUser({
      body: {
        email: data.email,
        name: data.name,
        password: data.password,
        role: data.role,
      },
      headers,
    })

    await usersRepository.createAuditEvent({
      action: 'user-created',
      actorUserId: session.user.id,
      actorEmail: session.user.email,
      targetUserId: result.user.id,
      targetEmail: result.user.email,
      metadata: { source: 'admin-create' },
    })

    return { success: true, user: result.user }
  })
