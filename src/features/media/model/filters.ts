import { z } from 'zod'
import {
  mediaAssetSortValues,
  mediaAssetTypeValues,
} from '@/features/media/model/types'

const positiveInt = z.coerce.number().int().positive()

export const mediaAssetTypeSchema = z.enum(mediaAssetTypeValues)

export const mediaAssetSortSchema = z.enum(mediaAssetSortValues)

export const mediaAssetFiltersSchema = z.object({
  query: z.string().trim().max(120).optional(),
  type: mediaAssetTypeSchema.optional(),
  uploadedById: z.string().trim().min(1).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  sort: mediaAssetSortSchema.default('created-desc'),
  page: positiveInt.default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type MediaAssetFiltersInput = z.infer<typeof mediaAssetFiltersSchema>
