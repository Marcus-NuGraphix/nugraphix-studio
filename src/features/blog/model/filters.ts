import { z } from 'zod'
import { blogPostStatusValues } from '@/features/blog/model/types'

export const blogAdminPostFiltersSchema = z.object({
  query: z.string().trim().max(120).optional(),
  status: z.enum(blogPostStatusValues).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
  sort: z
    .enum([
      'updated-desc',
      'updated-asc',
      'title-asc',
      'title-desc',
      'published-desc',
    ])
    .default('updated-desc'),
})

export const blogPublicPostFiltersSchema = z.object({
  query: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(24).default(9),
})

export type BlogAdminPostFiltersInput = z.infer<typeof blogAdminPostFiltersSchema>
export type BlogPublicPostFiltersInput = z.infer<typeof blogPublicPostFiltersSchema>
