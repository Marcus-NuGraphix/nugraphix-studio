import type { MediaAssetSummary, MediaAssetType } from '@/features/media/model/types'

const byteFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
})

export const mediaTypeLabels: Record<MediaAssetType, string> = {
  image: 'Image',
  document: 'Document',
  video: 'Video',
  audio: 'Audio',
  other: 'Other',
}

export const formatMediaSize = (sizeBytes: number) => {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`
  }

  if (sizeBytes < 1024 * 1024) {
    return `${byteFormatter.format(sizeBytes / 1024)} KB`
  }

  if (sizeBytes < 1024 * 1024 * 1024) {
    return `${byteFormatter.format(sizeBytes / (1024 * 1024))} MB`
  }

  return `${byteFormatter.format(sizeBytes / (1024 * 1024 * 1024))} GB`
}

export const formatMediaDimensions = (asset: Pick<MediaAssetSummary, 'width' | 'height'>) => {
  if (!asset.width || !asset.height) {
    return 'Unknown'
  }

  return `${asset.width} x ${asset.height}`
}

export const toMediaDateTimeLabel = (value: Date | string) =>
  new Date(value).toLocaleString()
