import { z } from 'zod'

export const maxImageBytes = 8 * 1024 * 1024
export const maxDocumentBytes = 25 * 1024 * 1024

export const imageContentTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
] as const

export type ImageContentType = (typeof imageContentTypes)[number]

export const mediaUploadBaseSchema = z.object({
  dataUrl: z.string().min(1),
  fileName: z.string().trim().min(1).max(255),
})

export const mediaImageUploadSchema = mediaUploadBaseSchema.extend({
  contentType: z.enum(imageContentTypes),
})

export const mediaPdfUploadSchema = mediaUploadBaseSchema.extend({
  contentType: z.literal('application/pdf'),
})

export type MediaImageUploadInput = z.infer<typeof mediaImageUploadSchema>
export type MediaPdfUploadInput = z.infer<typeof mediaPdfUploadSchema>
