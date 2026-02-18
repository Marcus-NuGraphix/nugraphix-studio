import { z } from 'zod'
import { mediaAssetTypeSchema } from '@/features/media/model/filters'

const toOptionalTrimmedString = (value: string | undefined) => {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : undefined
}

const optionalTrimmedText = (maxLength: number) =>
  z
    .union([z.string().max(maxLength), z.undefined()])
    .transform((value) => toOptionalTrimmedString(value))

export const mediaAssetMetadataSchema = z.object({
  id: z.string().trim().min(1),
  altText: optionalTrimmedText(180),
  type: mediaAssetTypeSchema,
})

export type MediaAssetMetadataInput = z.infer<typeof mediaAssetMetadataSchema>
