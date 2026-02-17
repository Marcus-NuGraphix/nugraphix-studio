import { z } from 'zod'
import {
  emailMessageStatusValues,
  emailTopicValues,
} from '@/features/email/model/types'

const positiveInt = z.coerce.number().int().positive()

export const emailAdminFiltersSchema = z.object({
  query: z.string().trim().max(120).optional(),
  status: z.enum(emailMessageStatusValues).optional(),
  topic: z.enum(emailTopicValues).optional(),
  page: positiveInt.optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
})

export const retryEmailSchema = z.object({
  id: z.string().min(1),
})

export type EmailAdminFiltersInput = z.infer<typeof emailAdminFiltersSchema>
