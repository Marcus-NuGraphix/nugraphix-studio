import type { UserRole } from '@/features/auth/model/session'

export const permissionValues = [
  'users.read',
  'users.write',
  'users.delete',
  'users.sessions.revoke',
  'account.update',
  'account.security.manage',
] as const

export type Permission = (typeof permissionValues)[number]

const rolePermissionMap: Record<UserRole, Array<Permission>> = {
  admin: [
    'users.read',
    'users.write',
    'users.delete',
    'users.sessions.revoke',
    'account.update',
    'account.security.manage',
  ],
  user: ['account.update', 'account.security.manage'],
}

export const hasPermission = (role: UserRole, permission: Permission) =>
  rolePermissionMap[role].includes(permission)
