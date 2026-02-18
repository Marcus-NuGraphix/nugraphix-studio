'use client'

import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  File,
  FileAudio2,
  FileText,
  Image as ImageIcon,
  Pencil,
  Trash2,
  Video,
  X,
  ZoomIn,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
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

const toMediaPreviewSource = (asset: MediaAssetSummary) =>
  asset.previewUrl ?? asset.thumbnailUrl ?? asset.url

function MediaImagePreview({ asset }: { asset: MediaAssetSummary }) {
  const [failed, setFailed] = useState(false)
  const src = toMediaPreviewSource(asset)

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
  const shouldReduceMotion = useReducedMotion() ?? false
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const imageAssets = useMemo(
    () => assets.filter((asset) => asset.type === 'image'),
    [assets],
  )
  const selectedImageIndex = useMemo(
    () => imageAssets.findIndex((asset) => asset.id === selectedImageId),
    [imageAssets, selectedImageId],
  )
  const selectedImage =
    selectedImageIndex >= 0 ? imageAssets[selectedImageIndex] : null

  useEffect(() => {
    if (!selectedImage) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedImage])

  const goToNextImage = () => {
    if (selectedImageIndex < 0 || imageAssets.length === 0) {
      return
    }

    const nextIndex = (selectedImageIndex + 1) % imageAssets.length
    setSelectedImageId(imageAssets[nextIndex].id)
  }

  const goToPreviousImage = () => {
    if (selectedImageIndex < 0 || imageAssets.length === 0) {
      return
    }

    const previousIndex =
      (selectedImageIndex - 1 + imageAssets.length) % imageAssets.length
    setSelectedImageId(imageAssets[previousIndex].id)
  }

  useEffect(() => {
    if (!selectedImage) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImageId(null)
      } else if (event.key === 'ArrowRight') {
        goToNextImage()
      } else if (event.key === 'ArrowLeft') {
        goToPreviousImage()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedImage, selectedImageIndex, imageAssets])

  const onImageCardKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    assetId: string,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    setSelectedImageId(assetId)
  }

  const cards = useMemo(
    () =>
      assets.map((asset) => {
        const TypeIcon = typeIconMap[asset.type]

        return (
          <Card
            key={asset.id}
            className="overflow-hidden rounded-xl border-border bg-card shadow-none"
          >
            <div className="h-40 border-b border-border bg-muted/40">
              {asset.type === 'image' ? (
                <button
                  type="button"
                  className="group relative block size-full cursor-zoom-in text-left"
                  onClick={() => setSelectedImageId(asset.id)}
                  onKeyDown={(event) => onImageCardKeyDown(event, asset.id)}
                  aria-label={`Open ${asset.fileName} in gallery view`}
                >
                  <MediaImagePreview asset={asset} />
                  <motion.div
                    initial={false}
                    whileHover={shouldReduceMotion ? undefined : { opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-foreground/70 opacity-0 transition-opacity group-focus-within:opacity-100"
                  >
                    <div className="space-y-1 text-center">
                      <ZoomIn className="mx-auto size-5 text-background" />
                      <p className="text-xs font-semibold text-background">
                        View gallery
                      </p>
                    </div>
                  </motion.div>
                </button>
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
                <p className="line-clamp-1 text-sm font-semibold text-foreground">
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
                Uploaded by {asset.uploadedBy.name} on {toMediaDateTimeLabel(asset.createdAt)}
              </p>
              <p className="text-xs text-muted-foreground">
                Alt text: {asset.altText ? 'Set' : 'Missing'}
              </p>
            </CardContent>

            <CardFooter className="flex items-center justify-end gap-1 border-t border-border p-2">
              <Button variant="ghost" size="icon" onClick={() => onPreview(asset)}>
                <Eye className="size-4" />
                <span className="sr-only">Preview</span>
              </Button>

              <Button variant="ghost" size="icon" asChild>
                <Link
                  to="/admin/workspaces/content/media/$assetId"
                  params={{ assetId: asset.id }}
                >
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
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </CardFooter>
          </Card>
        )
      }),
    [assets, onDelete, onPreview, shouldReduceMotion],
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

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards}</section>

      <AnimatePresence>
        {selectedImage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[70] bg-background/85 p-4 backdrop-blur-md"
            onClick={() => setSelectedImageId(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-media-gallery-title"
            aria-describedby="admin-media-gallery-description"
          >
            <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
              <motion.div
                initial={shouldReduceMotion ? false : { scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { scale: 0.96, opacity: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.22,
                  ease: 'easeOut',
                }}
                onClick={(event) => event.stopPropagation()}
                className="relative w-full max-w-5xl"
              >
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  className="absolute right-3 top-3 z-10 rounded-full border-border bg-card/85"
                  onClick={() => setSelectedImageId(null)}
                  aria-label="Close gallery view"
                >
                  <X className="size-4" />
                </Button>

                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border-border bg-card/85"
                  onClick={goToPreviousImage}
                  aria-label="Show previous image"
                >
                  <ChevronLeft className="size-4" />
                </Button>

                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border-border bg-card/85"
                  onClick={goToNextImage}
                  aria-label="Show next image"
                >
                  <ChevronRight className="size-4" />
                </Button>

                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <motion.img
                    key={selectedImage.id}
                    src={toMediaPreviewSource(selectedImage)}
                    alt={selectedImage.altText ?? selectedImage.fileName}
                    className="max-h-[72vh] w-full object-cover"
                    initial={shouldReduceMotion ? false : { opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                  />

                  <div className="space-y-2 border-t border-border bg-card/90 px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        id="admin-media-gallery-title"
                        className="text-base font-semibold text-card-foreground"
                      >
                        {selectedImage.fileName}
                      </h3>
                      <Badge variant="outline">Image</Badge>
                      <Badge variant="outline">{formatMediaSize(selectedImage.sizeBytes)}</Badge>
                    </div>
                    <p
                      id="admin-media-gallery-description"
                      className="text-sm text-muted-foreground"
                    >
                      Uploaded by {selectedImage.uploadedBy.name} on{' '}
                      {toMediaDateTimeLabel(selectedImage.createdAt)}.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPreview(selectedImage)}
                      >
                        <Eye className="size-4" />
                        Open full preview
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <Link
                          to="/admin/workspaces/content/media/$assetId"
                          params={{ assetId: selectedImage.id }}
                        >
                          <Pencil className="size-4" />
                          Edit metadata
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
