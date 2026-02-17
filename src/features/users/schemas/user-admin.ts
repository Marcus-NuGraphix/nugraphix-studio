import { z } from 'zod'
import { roleValues } from '@/features/auth/model/session'

export const userIdSchema = z.object({
  id: z.string().min(1),
})

export const setUserRoleSchema = z.object({
  id: z.string().min(1),
  role: z.enum(roleValues),
})

export const suspendUserSchema = z.object({
  id: z.string().min(1),
  reason: z.string().trim().min(3).max(240),
})

export const reactivateUserSchema = userIdSchema

export const revokeUserSessionsSchema = userIdSchema
