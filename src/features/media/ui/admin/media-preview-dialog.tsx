import {
  File,
  FileAudio2,
  FileText,
  Image as ImageIcon,
  Video,
} from 'lucide-react'
import { toast } from 'sonner'
import type { MediaAssetSummary, MediaAssetType } from '@/features/media/model/types'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  copyToClipboard,
  nativeShare,
} from '@/lib/utils'
import { formatMediaSize, mediaTypeLabels } from '@/features/media/model/format'
import { DocumentToolbar } from '@/features/media/ui/document/document-toolbar'
import { PdfInlineViewer } from '@/features/media/ui/document/pdf-inline-viewer'

interface MediaPreviewDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  asset: MediaAssetSummary | null
}

const typeIconMap: Record<MediaAssetType, typeof ImageIcon> = {
  image: ImageIcon,
  document: FileText,
  video: Video,
  audio: FileAudio2,
  other: File,
}

const downloadAsset = (asset: MediaAssetSummary) => {
  const anchor = document.createElement('a')
  anchor.href = asset.url
  anchor.download = asset.fileName
  anchor.rel = 'noopener'
  anchor.target = '_blank'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

const openAsset = (asset: MediaAssetSummary) => {
  window.open(asset.url, '_blank', 'noopener,noreferrer')
}

function MediaPreviewBody({ asset }: { asset: MediaAssetSummary }) {
  const TypeIcon = typeIconMap[asset.type]

  const handleCopyLink = async () => {
    const copied = await copyToClipboard(asset.url)
    if (copied) {
      toast.success('Media link copied.')
      return
    }

    toast.error('Unable to copy the media link on this device.')
  }

  const handleShare = async () => {
    const shared = await nativeShare({
      title: asset.fileName,
      description: `Media asset from Nu Graphix Studio (${mediaTypeLabels[asset.type]}).`,
      url: asset.url,
    })

    if (shared) {
      return
    }

    openAsset(asset)
  }

  const metadata = (
    <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2 text-xs text-muted-foreground">
      <Badge variant="outline">{mediaTypeLabels[asset.type]}</Badge>
      <span>{asset.mimeType}</span>
      <span>{formatMediaSize(asset.sizeBytes)}</span>
      <span>Uploaded by {asset.uploadedBy.name}</span>
    </div>
  )

  if (asset.type === 'document') {
    return (
      <>
        {metadata}
        <DocumentToolbar
          onOpen={() => openAsset(asset)}
          onDownload={() => downloadAsset(asset)}
          onCopyLink={() => {
            void handleCopyLink()
          }}
          onShare={() => {
            void handleShare()
          }}
        />
        <PdfInlineViewer src={asset.url} title={asset.fileName} />
      </>
    )
  }

  if (asset.type === 'image') {
    return (
      <>
        {metadata}
        <ScrollArea className="max-h-[75vh]">
          <img
            src={asset.previewUrl ?? asset.thumbnailUrl ?? asset.url}
            alt={asset.altText ?? asset.fileName}
            className="h-auto w-full"
          />
        </ScrollArea>
      </>
    )
  }

  if (asset.type === 'video') {
    return (
      <>
        {metadata}
        <div className="p-4">
          <video
            src={asset.url}
            controls
            className="h-auto max-h-[70vh] w-full rounded-lg border border-border"
          />
        </div>
      </>
    )
  }

  if (asset.type === 'audio') {
    return (
      <>
        {metadata}
        <div className="p-4">
          <audio src={asset.url} controls className="w-full" />
        </div>
      </>
    )
  }

  return (
    <>
      {metadata}
      <div className="text-muted-foreground grid min-h-[280px] place-content-center gap-3 p-6 text-center">
        <TypeIcon className="mx-auto size-8" />
        <p className="text-sm">Preview is not available for this file type.</p>
      </div>
    </>
  )
}

export function MediaPreviewDialog({
  isOpen,
  onOpenChange,
  asset,
}: MediaPreviewDialogProps) {
  const isMobile = useIsMobile()

  if (!asset) {
    return null
  }

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="space-y-1 border-b border-border">
            <DrawerTitle className="line-clamp-1">{asset.fileName}</DrawerTitle>
            <DrawerDescription className="line-clamp-2">
              {asset.altText ?? 'Preview and inspect media metadata from the admin library.'}
            </DrawerDescription>
          </DrawerHeader>
          <MediaPreviewBody asset={asset} />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-4 py-3">
          <DialogTitle className="line-clamp-1">{asset.fileName}</DialogTitle>
          <DialogDescription className="line-clamp-2">
            {asset.altText ?? 'Preview and inspect media metadata from the admin library.'}
          </DialogDescription>
        </DialogHeader>
        <MediaPreviewBody asset={asset} />
      </DialogContent>
    </Dialog>
  )
}
