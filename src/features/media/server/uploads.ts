import { createServerFn } from '@tanstack/react-start'
import type { MediaAssetType, MediaUploadResult } from '@/features/media/model/types'
import type { ServerResult } from '@/lib/errors'
import {
  maxDocumentBytes,
  maxImageBytes,
  mediaImageUploadSchema,
  mediaPdfUploadSchema,
} from '@/features/media/schemas/upload'
import { mediaRepository } from '@/features/media/server/repository'
import { uploadPublicObject } from '@/features/media/server/s3.server'
import { ok, toServerFail } from '@/lib/errors'
import { logMutationResult, logger } from '@/lib/observability'

const mediaLogger = logger.child({ domain: 'media' })

const requireAdminSession = async () => {
  const { requireAdmin } = await import('@/features/auth/server/session.server')
  return requireAdmin()
}

const toMediaAssetType = (contentType: string): MediaAssetType => {
  if (contentType.startsWith('image/')) return 'image'
  if (contentType.startsWith('video/')) return 'video'
  if (contentType.startsWith('audio/')) return 'audio'
  if (contentType === 'application/pdf') return 'document'
  return 'other'
}

const toSafeFileName = (fileName: string) =>
  fileName
    .replace(/[\r\n]+/g, ' ')
    .replace(/"/g, '')
    .trim()

const parseDataUrl = (dataUrl: string, expectedContentType: string) => {
  const match = dataUrl.match(/^data:([^;,]+);base64,(.+)$/)
  if (!match) {
    throw new Error('Invalid upload payload.')
  }

  const [, mimeType, base64Payload] = match
  if (mimeType !== expectedContentType) {
    throw new Error('File type mismatch.')
  }

  const buffer = Buffer.from(base64Payload, 'base64')

  if (buffer.byteLength === 0) {
    throw new Error('Uploaded file is empty.')
  }

  return {
    mimeType,
    buffer,
  }
}

const persistMediaAsset = async ({
  key,
  url,
  type,
  fileName,
  mimeType,
  sizeBytes,
  uploadedById,
  previewUrl,
  thumbnailUrl,
}: {
  key: string
  url: string
  type: MediaAssetType
  fileName: string
  mimeType: string
  sizeBytes: number
  uploadedById: string
  previewUrl: string | null
  thumbnailUrl: string | null
}): Promise<MediaUploadResult> => {
  const id = crypto.randomUUID()

  await mediaRepository.create({
    id,
    key,
    url,
    type,
    mimeType,
    fileName,
    sizeBytes,
    previewUrl,
    thumbnailUrl,
    uploadedById,
  })

  return {
    id,
    key,
    url,
    type,
    fileName,
    mimeType,
    sizeBytes,
    previewUrl,
    thumbnailUrl,
  }
}

export const uploadBlogImageFn = createServerFn({ method: 'POST' })
  .inputValidator(mediaImageUploadSchema)
  .handler(
    async ({ data }): Promise<ServerResult<MediaUploadResult>> => {
      const startedAt = Date.now()
      let userId: string | null = null

      try {
        const session = await requireAdminSession()
        userId = session.user.id

        const safeFileName = toSafeFileName(data.fileName)
        const { buffer } = parseDataUrl(data.dataUrl, data.contentType)

        if (buffer.byteLength > maxImageBytes) {
          throw new Error('Image exceeds 8MB limit.')
        }

        const uploaded = await uploadPublicObject({
          body: buffer,
          contentType: data.contentType,
          fileName: safeFileName,
          keyPrefix: 'blog-images',
          contentDisposition: 'inline',
        })

        const persisted = await persistMediaAsset({
          key: uploaded.key,
          url: uploaded.url,
          type: toMediaAssetType(data.contentType),
          fileName: safeFileName,
          mimeType: data.contentType,
          sizeBytes: buffer.byteLength,
          previewUrl: uploaded.url,
          thumbnailUrl: uploaded.url,
          uploadedById: session.user.id,
        })

        logMutationResult(mediaLogger, {
          feature: 'media',
          action: 'upload-image',
          result: 'ok',
          userId,
          executionTimeMs: Date.now() - startedAt,
        })

        return ok(persisted)
      } catch (error) {
        if (error instanceof Response) throw error

        const converted = toServerFail(error)

        logMutationResult(mediaLogger, {
          feature: 'media',
          action: 'upload-image',
          result: 'fail',
          userId,
          errorCode: converted.error.code,
          executionTimeMs: Date.now() - startedAt,
        })

        return converted
      }
    },
  )

export const uploadPressReleasePdfFn = createServerFn({ method: 'POST' })
  .inputValidator(mediaPdfUploadSchema)
  .handler(
    async ({ data }): Promise<ServerResult<MediaUploadResult>> => {
      const startedAt = Date.now()
      let userId: string | null = null

      try {
        const session = await requireAdminSession()
        userId = session.user.id

        const safeFileName = toSafeFileName(data.fileName)
        const { buffer } = parseDataUrl(data.dataUrl, data.contentType)

        if (buffer.byteLength > maxDocumentBytes) {
          throw new Error('PDF exceeds 25MB limit.')
        }

        const uploaded = await uploadPublicObject({
          body: buffer,
          contentType: data.contentType,
          fileName: safeFileName,
          keyPrefix: 'press-releases',
          contentDisposition: `inline; filename="${safeFileName}"`,
        })

        const persisted = await persistMediaAsset({
          key: uploaded.key,
          url: uploaded.url,
          type: 'document',
          fileName: safeFileName,
          mimeType: data.contentType,
          sizeBytes: buffer.byteLength,
          previewUrl: uploaded.url,
          thumbnailUrl: null,
          uploadedById: session.user.id,
        })

        logMutationResult(mediaLogger, {
          feature: 'media',
          action: 'upload-document',
          result: 'ok',
          userId,
          executionTimeMs: Date.now() - startedAt,
        })

        return ok(persisted)
      } catch (error) {
        if (error instanceof Response) throw error

        const converted = toServerFail(error)

        logMutationResult(mediaLogger, {
          feature: 'media',
          action: 'upload-document',
          result: 'fail',
          userId,
          errorCode: converted.error.code,
          executionTimeMs: Date.now() - startedAt,
        })

        return converted
      }
    },
  )
