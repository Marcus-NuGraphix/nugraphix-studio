import { Copy, Download, ExternalLink, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DocumentToolbarProps {
  onOpen: () => void
  onDownload: () => void
  onCopyLink: () => void
  onShare: () => void
  disableShare?: boolean
}

export function DocumentToolbar({
  onOpen,
  onDownload,
  onCopyLink,
  onShare,
  disableShare = false,
}: DocumentToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
      <Button variant="outline" size="sm" onClick={onOpen}>
        <ExternalLink className="size-4" />
        Open
      </Button>
      <Button variant="outline" size="sm" onClick={onDownload}>
        <Download className="size-4" />
        Download
      </Button>
      <Button variant="outline" size="sm" onClick={onCopyLink}>
        <Copy className="size-4" />
        Copy Link
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onShare}
        disabled={disableShare}
      >
        <Share2 className="size-4" />
        Share
      </Button>
    </div>
  )
}
