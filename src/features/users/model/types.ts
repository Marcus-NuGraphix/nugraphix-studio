import type { UserRole } from '@/features/auth/model/session'
import type { UserStatus } from '@/features/users/model/filters'

export interface UserAdminListItem {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  suspendedAt: Date | null
  suspendedReason: string | null
}

export interface UserAuditItem {
  id: string
  action: string
  actorUserId: string | null
  actorEmail: string | null
  targetUserId: string | null
  targetEmail: string
  metadata: Record<string, unknown>
  createdAt: Date
}

export interface UserAdminSessionItem {
  id: string
  userId: string
  userName: string
  userEmail: string
  userRole: UserRole
  userStatus: UserStatus
  userAgent: string | null
  ipAddress: string | null
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}
