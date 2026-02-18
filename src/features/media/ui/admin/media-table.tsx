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
import type { ColumnDef } from '@tanstack/react-table'
import type { MediaAssetSummary, MediaAssetType } from '@/features/media/model/types'
import { EmptyState } from '@/components/empties'
import { DataTable, DataTableColumnHeader } from '@/components/tables'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  formatMediaDimensions,
  formatMediaSize,
  mediaTypeLabels,
  toMediaDateTimeLabel,
} from '@/features/media/model/format'

interface MediaTableProps {
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

function TableImagePreview({ asset }: { asset: MediaAssetSummary }) {
  const [failed, setFailed] = useState(false)
  const src = asset.previewUrl ?? asset.thumbnailUrl ?? asset.url

  if (failed || !src) {
    return (
      <div className="text-muted-foreground grid size-full place-content-center">
        <ImageIcon className="size-4" />
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

export function MediaTable({ assets, onDelete, onPreview }: MediaTableProps) {
  const columns = useMemo<Array<ColumnDef<MediaAssetSummary>>>(
    () => [
      {
        accessorKey: 'fileName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="File" />
        ),
        cell: ({ row }) => {
          const asset = row.original
          const TypeIcon = typeIconMap[asset.type]

          return (
            <div className="flex items-start gap-3">
              <div className="bg-muted/40 mt-0.5 size-12 shrink-0 overflow-hidden rounded-lg border border-border">
                {asset.type === 'image' ? (
                  <TableImagePreview asset={asset} />
                ) : (
                  <div className="text-muted-foreground grid size-full place-content-center">
                    <TypeIcon className="size-5" />
                  </div>
                )}
              </div>

              <div className="space-y-0.5">
                <p className="text-foreground line-clamp-1 text-sm font-medium">
                  {asset.fileName}
                </p>
                <p className="font-mono text-xs text-muted-foreground">{asset.mimeType}</p>
              </div>
            </div>
          )
        },
      },
      {
        id: 'type',
        accessorFn: (row) => row.type,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ row }) => (
          <Badge variant="outline">{mediaTypeLabels[row.original.type]}</Badge>
        ),
      },
      {
        id: 'metadata',
        accessorFn: (row) => `${row.sizeBytes}-${row.width}-${row.height}`,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Metadata" />
        ),
        cell: ({ row }) => (
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p>Size: {formatMediaSize(row.original.sizeBytes)}</p>
            <p>Dimensions: {formatMediaDimensions(row.original)}</p>
            <p>Alt text: {row.original.altText ? 'Set' : 'Missing'}</p>
          </div>
        ),
      },
      {
        id: 'uploadedBy',
        accessorFn: (row) => row.uploadedBy.name,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Uploaded" />
        ),
        cell: ({ row }) => (
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p className="text-sm font-medium text-foreground">{row.original.uploadedBy.name}</p>
            <p>{toMediaDateTimeLabel(row.original.createdAt)}</p>
          </div>
        ),
      },
      {
        id: 'actions',
        enableSorting: false,
        header: () => (
          <div className="text-right text-xs font-semibold uppercase">Actions</div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(event) => {
                event.stopPropagation()
                onPreview(row.original)
              }}
            >
              <Eye className="size-4" />
              <span className="sr-only">Preview</span>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/media/$assetId" params={{ assetId: row.original.id }}>
                <Pencil className="size-4" />
                <span className="sr-only">Edit metadata</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Delete ${row.original.fileName}`}
              onClick={(event) => {
                event.stopPropagation()
                onDelete(row.original.id)
              }}
            >
              <Trash2 className="text-destructive size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onDelete, onPreview],
  )

  return (
    <DataTable
      columns={columns}
      data={assets}
      enablePagination={false}
      className="rounded-xl border border-border bg-card p-3 shadow-none"
      tableClassName="bg-card"
      emptyState={
        <EmptyState
          icon={ImageIcon}
          title="No media assets found"
          description="Adjust filters or upload files to populate the media table."
        />
      }
    />
  )
}
