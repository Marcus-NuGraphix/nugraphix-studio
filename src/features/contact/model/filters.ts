import { z } from 'zod'
import {
  contactServiceInterestValues,
  contactUrgencyValues,
} from '@/features/contact/model/lead-form'
import { contactSubmissionStatusValues } from '@/features/contact/model/types'

const positiveInt = z.coerce.number().int().positive()

export const contactAssignmentFilterValues = ['assigned', 'unassigned'] as const
export const contactAssignmentFilterSchema = z.enum(
  contactAssignmentFilterValues,
)

export const contactAdminSortValues = [
  'created-desc',
  'created-asc',
  'updated-desc',
] as const
export const contactAdminSortSchema = z.enum(contactAdminSortValues)

export const contactAdminFiltersSchema = z.object({
  query: z.string().trim().max(160).optional(),
  status: z.enum(contactSubmissionStatusValues).optional(),
  serviceInterest: z.enum(contactServiceInterestValues).optional(),
  urgency: z.enum(contactUrgencyValues).optional(),
  assignment: contactAssignmentFilterSchema.optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  sort: contactAdminSortSchema.optional().default('created-desc'),
  page: positiveInt.optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
})

export type ContactAssignmentFilter = z.infer<
  typeof contactAssignmentFilterSchema
>
export type ContactAdminSort = z.infer<typeof contactAdminSortSchema>
export type ContactAdminFiltersInput = z.infer<typeof contactAdminFiltersSchema>
