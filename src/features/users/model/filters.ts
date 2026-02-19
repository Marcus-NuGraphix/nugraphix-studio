import { z } from 'zod'
import { roleValues } from '@/features/auth/model/session'

const positiveInt = z.coerce.number().int().positive()

export const userStatusValues = ['active', 'suspended', 'invited'] as const
export const userStatusSchema = z.enum(userStatusValues)

export const userAdminSortSchema = z.enum([
  'created-desc',
  'created-asc',
  'name-asc',
  'name-desc',
])

export const userAdminFiltersSchema = z.object({
  query: z.string().trim().max(120).optional(),
  role: z.enum(roleValues).optional(),
  status: userStatusSchema.optional(),
  emailVerified: z.coerce.boolean().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  sort: userAdminSortSchema.optional().default('created-desc'),
  page: positiveInt.optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
})

export type UserStatus = z.infer<typeof userStatusSchema>
export type UserAdminFiltersInput = z.infer<typeof userAdminFiltersSchema>
