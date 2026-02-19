export const mediaAssetTypeValues = [
  'image',
  'document',
  'video',
  'audio',
  'other',
] as const

export type MediaAssetType = (typeof mediaAssetTypeValues)[number]

export const mediaAssetSortValues = [
  'created-desc',
  'created-asc',
  'name-asc',
  'size-desc',
] as const

export type MediaAssetSortOption = (typeof mediaAssetSortValues)[number]

export interface MediaUploaderSummary {
  id: string
  name: string
  email: string
}

export interface MediaAssetSummary {
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
  uploadedBy: MediaUploaderSummary
}

export interface MediaAssetListResult {
  assets: Array<MediaAssetSummary>
  total: number
  typeTotals: Record<MediaAssetType, number>
  page: number
  pageSize: number
  totalPages: number
}

export interface MediaUploadResult {
  id: string
  key: string
  url: string
  type: MediaAssetType
  fileName: string
  mimeType: string
  sizeBytes: number
  previewUrl: string | null
  thumbnailUrl: string | null
}
