import type { UserRole } from '@/features/auth/model/session'
import { toSafeRedirectPath } from '@/features/auth/model/redirect'

const roleLandingMap = {
  admin: '/admin/workspaces/operations/dashboard',
  user: '/blog',
} as const satisfies Record<UserRole, string>

export type RoleLandingPath = (typeof roleLandingMap)[UserRole]

export const toUserRole = (value: unknown): UserRole =>
  value === 'admin' ? 'admin' : 'user'

const hasUserRole = (value: unknown): value is { user?: { role?: unknown } } =>
  Boolean(value && typeof value === 'object')

export const toUserRoleFromClientSession = (session: unknown): UserRole => {
  if (!hasUserRole(session)) {
    return 'user'
  }

  return toUserRole(session.user?.role)
}

export const getRoleLandingPath = (role: UserRole): RoleLandingPath =>
  roleLandingMap[role]

export const resolvePostAuthRedirect = ({
  requestedRedirect,
  role,
}: {
  requestedRedirect?: string
  role: UserRole
}) => {
  const safeRedirect = toSafeRedirectPath(requestedRedirect, '')
  return safeRedirect || getRoleLandingPath(role)
}
