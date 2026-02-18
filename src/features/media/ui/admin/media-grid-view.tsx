import { Link } from '@tanstack/react-router'
import {
  Eye,
  File,
  FileAudio2,
  FileText,
  Image as ImageIcon,
  Pencil,
  Trash2,
  Video,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { MediaAssetSummary, MediaAssetType } from '@/features/media/model/types'
import { EmptyState } from '@/components/empties'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  formatMediaDimensions,
  formatMediaSize,
  mediaTypeLabels,
  toMediaDateTimeLabel,
} from '@/features/media/model/format'

interface MediaGridViewProps {
  assets: Array<MediaAssetSummary>
  onDelete: (id: string) => void
  onPreview: (asset: MediaAssetSummary) => void
}

const typeIconMap: Record<MediaAssetType, typeof ImageIcon> = {
  image: ImageIcon,
  document: FileText,
  video: Video,
  audio: FileAudio2,
  other: File,
}

function MediaImagePreview({ asset }: { asset: MediaAssetSummary }) {
  const [failed, setFailed] = useState(false)
  const src = asset.previewUrl ?? asset.thumbnailUrl ?? asset.url

  if (failed || !src) {
    return (
      <div className="text-muted-foreground grid size-full place-content-center gap-1 text-center">
        <ImageIcon className="mx-auto size-6" />
        <p className="text-xs">Preview unavailable</p>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={asset.altText ?? asset.fileName}
      className="size-full object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

export function MediaGridView({ assets, onDelete, onPreview }: MediaGridViewProps) {
  const cards = useMemo(
    () =>
      assets.map((asset) => {
        const TypeIcon = typeIconMap[asset.type]

        return (
          <Card
            key={asset.id}
            className="border-border bg-card overflow-hidden rounded-xl shadow-none"
          >
            <div className="bg-muted/40 h-40 border-b border-border">
              {asset.type === 'image' ? (
                <MediaImagePreview asset={asset} />
              ) : (
                <div className="text-muted-foreground grid size-full place-content-center gap-2 text-center">
                  <TypeIcon className="mx-auto size-7" />
                  <p className="text-xs font-medium uppercase">
                    {mediaTypeLabels[asset.type]}
                  </p>
                </div>
              )}
            </div>

            <CardContent className="space-y-3 p-3">
              <div className="space-y-0.5">
                <p className="text-foreground line-clamp-1 text-sm font-semibold">
                  {asset.fileName}
                </p>
                <p className="font-mono text-xs text-muted-foreground">{asset.mimeType}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{mediaTypeLabels[asset.type]}</Badge>
                <span>{formatMediaSize(asset.sizeBytes)}</span>
                <span>{formatMediaDimensions(asset)}</span>
              </div>

              <p className="text-xs text-muted-foreground">
                Uploaded by {asset.uploadedBy.name} on{' '}
                {toMediaDateTimeLabel(asset.createdAt)}
              </p>
              <p className="text-xs text-muted-foreground">
                Alt text: {asset.altText ? 'Set' : 'Missing'}
              </p>
            </CardContent>

            <CardFooter className="border-border flex items-center justify-end gap-1 border-t p-2">
              <Button variant="ghost" size="icon" onClick={() => onPreview(asset)}>
                <Eye className="size-4" />
                <span className="sr-only">Preview</span>
              </Button>

              <Button variant="ghost" size="icon" asChild>
                <Link to="/admin/media/$assetId" params={{ assetId: asset.id }}>
                  <Pencil className="size-4" />
                  <span className="sr-only">Edit metadata</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${asset.fileName}`}
                onClick={() => onDelete(asset.id)}
              >
                <Trash2 className="text-destructive size-4" />
              </Button>
            </CardFooter>
          </Card>
        )
      }),
    [assets, onDelete, onPreview],
  )

  if (cards.length === 0) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="No media assets found"
        description="Adjust filters or upload files to build your reusable media library."
      />
    )
  }

  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards}</section>
}
