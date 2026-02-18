import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { MediaAssetSummary } from '@/features/media/model/types'
import type { ServerResult } from '@/lib/errors'
import { mediaAssetFiltersSchema } from '@/features/media/model/filters'
import { mediaAssetMetadataSchema } from '@/features/media/schemas/asset'
import { mediaRepository } from '@/features/media/server/repository'
import { deletePublicObject } from '@/features/media/server/s3.server'
import { fail, ok, toServerFail } from '@/lib/errors'
import { logMutationResult, logger } from '@/lib/observability'

const mediaLogger = logger.child({ domain: 'media' })

const requireAdminSession = async () => {
  const { requireAdmin } = await import('@/features/auth/server/session.server')
  return requireAdmin()
}

const adminFiltersInputSchema = mediaAssetFiltersSchema.partial().default({})

const toListPayload = (
  result: Awaited<ReturnType<typeof mediaRepository.listAssets>>,
  page: number,
  pageSize: number,
) => ({
  assets: result.assets,
  total: result.total,
  typeTotals: result.typeTotals,
  page,
  pageSize,
  totalPages: Math.max(1, Math.ceil(result.total / pageSize)),
})

export const getAdminMediaAssetsFn = createServerFn({ method: 'GET' })
  .inputValidator(adminFiltersInputSchema)
  .handler(async ({ data }) => {
    await requireAdminSession()

    const filters = mediaAssetFiltersSchema.parse(data)
    const result = await mediaRepository.listAssets(filters)

    return {
      ...toListPayload(result, filters.page, filters.pageSize),
      filters,
    }
  })

export const getMediaAssetByIdFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      id: z.string().trim().min(1),
    }),
  )
  .handler(
    async ({ data }): Promise<ServerResult<MediaAssetSummary>> => {
      try {
        await requireAdminSession()

        const asset = await mediaRepository.findById(data.id)
        if (!asset) {
          return fail('NOT_FOUND', 'Media asset not found.')
        }

        return ok(asset)
      } catch (error) {
        if (error instanceof Response) throw error
        return toServerFail(error)
      }
    },
  )

export const updateMediaAssetMetadataFn = createServerFn({ method: 'POST' })
  .inputValidator(mediaAssetMetadataSchema)
  .handler(
    async ({ data }): Promise<ServerResult<{ id: string }>> => {
      const startedAt = Date.now()
      let userId: string | null = null

      try {
        const session = await requireAdminSession()
        userId = session.user.id

        const existing = await mediaRepository.findById(data.id)
        if (!existing) {
          return fail('NOT_FOUND', 'Media asset not found.')
        }

        await mediaRepository.update(data.id, {
          type: data.type,
          altText: data.altText ?? null,
        })

        logMutationResult(mediaLogger, {
          feature: 'media',
          action: 'update-asset-metadata',
          result: 'ok',
          userId,
          executionTimeMs: Date.now() - startedAt,
        })

        return ok({ id: data.id })
      } catch (error) {
        if (error instanceof Response) throw error
        const converted = toServerFail(error)

        logMutationResult(mediaLogger, {
          feature: 'media',
          action: 'update-asset-metadata',
          result: 'fail',
          userId,
          errorCode: converted.error.code,
          executionTimeMs: Date.now() - startedAt,
        })

        return converted
      }
    },
  )

export const deleteMediaAssetFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string().trim().min(1),
    }),
  )
  .handler(
    async ({ data }): Promise<ServerResult<{ id: string }>> => {
      const startedAt = Date.now()
      let userId: string | null = null

      try {
        const session = await requireAdminSession()
        userId = session.user.id

        const existing = await mediaRepository.findById(data.id)
        if (!existing) {
          return fail('NOT_FOUND', 'Media asset not found.')
        }

        try {
          await deletePublicObject(existing.key)
        } catch (error) {
          mediaLogger.warn('media.asset.storage.delete_failed', {
            mediaAssetId: existing.id,
            key: existing.key,
            error,
          })
        }

        await mediaRepository.remove(data.id)

        logMutationResult(mediaLogger, {
          feature: 'media',
          action: 'delete-asset',
          result: 'ok',
          userId,
          executionTimeMs: Date.now() - startedAt,
        })

        return ok({ id: data.id })
      } catch (error) {
        if (error instanceof Response) throw error
        const converted = toServerFail(error)

        logMutationResult(mediaLogger, {
          feature: 'media',
          action: 'delete-asset',
          result: 'fail',
          userId,
          errorCode: converted.error.code,
          executionTimeMs: Date.now() - startedAt,
        })

        return converted
      }
    },
  )
