import { Link, createFileRoute, notFound, useRouter } from '@tanstack/react-router'
import { ExternalLink, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { MediaAssetType } from '@/features/media'
import {
  deleteMediaAssetFn,
  formatMediaSize,
  getMediaAssetByIdFn,
  mediaAssetTypeValues,
  mediaTypeLabels,
  toMediaDateTimeLabel,
  updateMediaAssetMetadataFn,
} from '@/features/media'
import { PageHeader } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const Route = createFileRoute('/admin/media/$assetId')({
  loader: async ({ params }) => {
    const result = await getMediaAssetByIdFn({ data: { id: params.assetId } })

    if (!result.ok) {
      if (result.error.code === 'NOT_FOUND') {
        throw notFound()
      }

      throw new Error(result.error.message)
    }

    return result.data
  },
  component: AdminMediaAssetDetailPage,
})

function AdminMediaAssetDetailPage() {
  const asset = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const router = useRouter()

  const [type, setType] = useState<MediaAssetType>(asset.type)
  const [altText, setAltText] = useState(asset.altText ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const renderPreview = () => {
    if (asset.type === 'image') {
      return (
        <img
          src={asset.previewUrl ?? asset.thumbnailUrl ?? asset.url}
          alt={asset.altText ?? asset.fileName}
          className="h-auto max-h-[480px] w-full rounded-lg border border-border object-contain"
        />
      )
    }

    if (asset.type === 'document') {
      return (
        <iframe
          title={asset.fileName}
          src={asset.url}
          className="h-[520px] w-full rounded-lg border border-border"
        />
      )
    }

    if (asset.type === 'video') {
      return (
        <video
          src={asset.url}
          controls
          className="h-auto max-h-[480px] w-full rounded-lg border border-border"
        />
      )
    }

    if (asset.type === 'audio') {
      return <audio src={asset.url} controls className="w-full" />
    }

    return (
      <div className="text-muted-foreground rounded-lg border border-border p-6 text-sm">
        No inline preview is available for this file type.
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Content Operations"
        title="Media Asset"
        description="Update metadata and verify how this asset renders before using it in editor workflows."
        actions={
          <Button variant="outline" asChild>
            <a href={asset.url} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              Open original
            </a>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {renderPreview()}
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">{mediaTypeLabels[asset.type]}</Badge>
              <Badge variant="outline">{formatMediaSize(asset.sizeBytes)}</Badge>
              <Badge variant="outline">{asset.mimeType}</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border bg-card shadow-none">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="media-file-name">File name</Label>
                <Input id="media-file-name" value={asset.fileName} disabled readOnly />
              </div>

              <div className="space-y-1">
                <Label htmlFor="media-type">Media type</Label>
                <Select
                  value={type}
                  onValueChange={(value) => setType(value as MediaAssetType)}
                >
                  <SelectTrigger id="media-type">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mediaAssetTypeValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {mediaTypeLabels[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="media-alt-text">Alt text</Label>
                <Input
                  id="media-alt-text"
                  value={altText}
                  onChange={(event) => setAltText(event.target.value)}
                  placeholder="Describe this asset for accessibility"
                />
              </div>

              <Button
                className="w-full"
                disabled={isSaving || isDeleting}
                onClick={async () => {
                  setIsSaving(true)
                  try {
                    const result = await updateMediaAssetMetadataFn({
                      data: {
                        id: asset.id,
                        type,
                        altText: altText.trim() || undefined,
                      },
                    })

                    if (!result.ok) {
                      toast.error(result.error.message)
                      return
                    }

                    toast.success('Media metadata updated.')
                    await router.invalidate({ sync: true })
                  } catch (error) {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : 'Unable to update metadata right now.',
                    )
                  } finally {
                    setIsSaving(false)
                  }
                }}
              >
                <Save className="size-4" />
                {isSaving ? 'Saving...' : 'Save metadata'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/30 bg-destructive/5 shadow-none">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Deleting this asset removes it from storage and metadata records.
              </p>
              <Button
                variant="destructive"
                className="w-full"
                disabled={isSaving || isDeleting}
                onClick={async () => {
                  setIsDeleting(true)
                  try {
                    const result = await deleteMediaAssetFn({
                      data: { id: asset.id },
                    })

                    if (!result.ok) {
                      toast.error(result.error.message)
                      return
                    }

                    toast.success('Media asset deleted.')
                    await navigate({ to: '/admin/media' })
                  } catch (error) {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : 'Unable to delete this media asset right now.',
                    )
                  } finally {
                    setIsDeleting(false)
                  }
                }}
              >
                <Trash2 className="size-4" />
                {isDeleting ? 'Deleting...' : 'Delete asset'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-none">
            <CardHeader>
              <CardTitle>Audit Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Uploaded by: {asset.uploadedBy.name}</p>
              <p>Uploaded at: {toMediaDateTimeLabel(asset.createdAt)}</p>
              <p>Last updated: {toMediaDateTimeLabel(asset.updatedAt)}</p>
              <p className="font-mono text-xs">Storage key: {asset.key}</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/media">Back to media library</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
