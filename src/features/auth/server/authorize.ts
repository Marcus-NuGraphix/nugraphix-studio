import type { AppSession } from '@/features/auth/model/session'
import type { Permission } from '@/features/auth/model/permissions'
import { hasPermission } from '@/features/auth/model/permissions'

export const assertPermission = (
  session: AppSession,
  permission: Permission,
) => {
  if (!hasPermission(session.user.role, permission)) {
    throw new Error('You are not authorized to perform this action')
  }
}
