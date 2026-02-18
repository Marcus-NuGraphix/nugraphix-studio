import { and, asc, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm'
import type { SQL } from 'drizzle-orm'
import type { MediaAssetFiltersInput } from '@/features/media/model/filters'
import type {
  MediaAssetSummary,
  MediaAssetType,
} from '@/features/media/model/types'
import { db, mediaAsset } from '@/lib/db'
import { normalizeSearchQuery } from '@/lib/search'

const uploaderColumns = {
  id: true,
  name: true,
  email: true,
} as const

type CreateMediaAssetValues = typeof mediaAsset.$inferInsert
type UpdateMediaAssetValues = Partial<typeof mediaAsset.$inferInsert>

const emptyTypeTotals = (): Record<MediaAssetType, number> => ({
  image: 0,
  document: 0,
  video: 0,
  audio: 0,
  other: 0,
})

const toMediaAssetSummary = (record: {
  id: string
  key: string
  url: string
  type: MediaAssetType
  mimeType: string
  fileName: string
  sizeBytes: number
  width: number | null
  height: number | null
  durationSeconds: number | null
  previewUrl: string | null
  thumbnailUrl: string | null
  altText: string | null
  createdAt: Date
  updatedAt: Date
  uploadedBy: {
    id: string
    name: string
    email: string
  }
}): MediaAssetSummary => ({
  ...record,
})

const buildScopedConditions = (filters: MediaAssetFiltersInput) => {
  const conditions: Array<SQL<unknown>> = []

  const normalizedQuery = normalizeSearchQuery(filters.query ?? '')
  if (normalizedQuery.length > 0) {
    const queryValue = `%${normalizedQuery}%`
    conditions.push(
      or(
        ilike(mediaAsset.fileName, queryValue),
        ilike(mediaAsset.mimeType, queryValue),
        ilike(mediaAsset.altText, queryValue),
      )!,
    )
  }

  if (filters.uploadedById) {
    conditions.push(eq(mediaAsset.uploadedById, filters.uploadedById))
  }

  if (filters.fromDate) {
    conditions.push(gte(mediaAsset.createdAt, new Date(filters.fromDate)))
  }

  if (filters.toDate) {
    conditions.push(lte(mediaAsset.createdAt, new Date(filters.toDate)))
  }

  return conditions
}

const resolveOrderBy = (sort: MediaAssetFiltersInput['sort']) => {
  if (sort === 'created-asc') {
    return [asc(mediaAsset.createdAt)]
  }

  if (sort === 'name-asc') {
    return [asc(mediaAsset.fileName), desc(mediaAsset.createdAt)]
  }

  if (sort === 'size-desc') {
    return [desc(mediaAsset.sizeBytes), desc(mediaAsset.createdAt)]
  }

  return [desc(mediaAsset.createdAt)]
}

const listAssets = async (filters: MediaAssetFiltersInput) => {
  const scopedConditions = buildScopedConditions(filters)
  const whereConditions = [...scopedConditions]

  if (filters.type) {
    whereConditions.push(eq(mediaAsset.type, filters.type))
  }

  const scopedWhere =
    scopedConditions.length > 0 ? and(...scopedConditions) : undefined
  const where = whereConditions.length > 0 ? and(...whereConditions) : undefined

  const [rows, countRows, typeRows] = await Promise.all([
    db.query.mediaAsset.findMany({
      where,
      orderBy: resolveOrderBy(filters.sort),
      limit: filters.pageSize,
      offset: (filters.page - 1) * filters.pageSize,
      with: { uploadedBy: { columns: uploaderColumns } },
    }),
    db
      .select({ value: sql<number>`count(*)::int` })
      .from(mediaAsset)
      .where(where),
    db
      .select({
        type: mediaAsset.type,
        value: sql<number>`count(*)::int`,
      })
      .from(mediaAsset)
      .where(scopedWhere)
      .groupBy(mediaAsset.type),
  ])

  const typeTotals = emptyTypeTotals()
  for (const row of typeRows) {
    typeTotals[row.type] = row.value
  }

  return {
    assets: rows.map((row) => toMediaAssetSummary(row)),
    total: countRows[0]?.value ?? 0,
    typeTotals,
  }
}

const findById = async (id: string) => {
  const row = await db.query.mediaAsset.findFirst({
    where: eq(mediaAsset.id, id),
    with: { uploadedBy: { columns: uploaderColumns } },
  })

  return row ? toMediaAssetSummary(row) : null
}

const create = async (values: CreateMediaAssetValues) => {
  await db.insert(mediaAsset).values(values)
}

const update = async (id: string, values: UpdateMediaAssetValues) => {
  await db.update(mediaAsset).set(values).where(eq(mediaAsset.id, id))
}

const remove = async (id: string) => {
  await db.delete(mediaAsset).where(eq(mediaAsset.id, id))
}

export const mediaRepository = {
  create,
  findById,
  listAssets,
  remove,
  update,
}
