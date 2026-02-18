import { createFileRoute, useRouter } from '@tanstack/react-router'
import { LayoutGrid, List, RefreshCcw } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { MediaAssetSummary } from '@/features/media'
import {
  MediaFilters,
  MediaGridView,
  MediaPreviewDialog,
  MediaTable,
  MediaTypeBadges,
  MediaUploadDropzone,
  deleteMediaAssetFn,
  getAdminMediaAssetsFn,
  mediaAssetFiltersSchema,
} from '@/features/media'
import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'

const mediaSearchSchema = mediaAssetFiltersSchema.partial()

export const Route = createFileRoute('/admin/media/')({
  validateSearch: (search) => mediaSearchSchema.parse(search),
  loaderDeps: ({ search }) => mediaAssetFiltersSchema.parse(search),
  loader: async ({ deps }) => getAdminMediaAssetsFn({ data: deps }),
  component: AdminMediaLibraryPage,
})

function AdminMediaLibraryPage() {
  const router = useRouter()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const data = Route.useLoaderData()

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [previewAsset, setPreviewAsset] = useState<MediaAssetSummary | null>(null)
  const [isDeletingAssetId, setIsDeletingAssetId] = useState<string | null>(null)

  const updateSearch = useCallback(
    (patch: Partial<typeof search>) => {
      void navigate({
        to: '/admin/media',
        search: (prev) =>
          mediaAssetFiltersSchema.parse({
            ...prev,
            ...patch,
          }),
      })
    },
    [navigate],
  )

  const refreshListing = useCallback(async () => {
    await router.invalidate({ sync: true })
  }, [router])

  const onDelete = useCallback(
    async (id: string) => {
      if (isDeletingAssetId) {
        return
      }

      setIsDeletingAssetId(id)

      try {
        const result = await deleteMediaAssetFn({ data: { id } })
        if (!result.ok) {
          toast.error(result.error.message)
          return
        }

        if (previewAsset?.id === id) {
          setPreviewAsset(null)
        }

        toast.success('Media asset deleted.')
        await refreshListing()
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Unable to delete this media asset right now.',
        )
      } finally {
        setIsDeletingAssetId(null)
      }
    },
    [isDeletingAssetId, previewAsset?.id, refreshListing],
  )

  const totalVisible = useMemo(() => data.assets.length, [data.assets.length])

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Content Operations"
        title="Media Library"
        description="Upload and manage reusable images and documents used across Nu Graphix Studio workflows."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="size-4" />
              Grid
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'table' ? 'default' : 'outline'}
              onClick={() => setViewMode('table')}
            >
              <List className="size-4" />
              Table
            </Button>
            <Button size="sm" variant="outline" onClick={() => void refreshListing()}>
              <RefreshCcw className="size-4" />
              Refresh
            </Button>
          </div>
        }
      />

      <MediaUploadDropzone
        onUploaded={() => {
          void refreshListing()
        }}
      />

      <MediaFilters
        query={data.filters.query}
        type={data.filters.type}
        sort={data.filters.sort}
        pageSize={data.filters.pageSize}
        fromDate={data.filters.fromDate}
        toDate={data.filters.toDate}
        onChange={(next) => updateSearch(next)}
      />

      <MediaTypeBadges
        activeType={data.filters.type}
        totals={data.typeTotals}
        onTypeChange={(type) => updateSearch({ type, page: 1 })}
      />

      {viewMode === 'grid' ? (
        <MediaGridView
          assets={data.assets}
          onPreview={(asset) => setPreviewAsset(asset)}
          onDelete={(id) => {
            void onDelete(id)
          }}
        />
      ) : (
        <MediaTable
          assets={data.assets}
          onPreview={(asset) => setPreviewAsset(asset)}
          onDelete={(id) => {
            void onDelete(id)
          }}
        />
      )}

      <div className="border-border bg-card flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3">
        <p className="text-sm text-muted-foreground">
          Showing {totalVisible} of {data.total} assets.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={data.page <= 1 || Boolean(isDeletingAssetId)}
            onClick={() => updateSearch({ page: data.page - 1 })}
          >
            Previous
          </Button>
          <p className="text-xs text-muted-foreground">
            Page {data.page} / {data.totalPages}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={data.page >= data.totalPages || Boolean(isDeletingAssetId)}
            onClick={() => updateSearch({ page: data.page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>

      <MediaPreviewDialog
        isOpen={previewAsset !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewAsset(null)
          }
        }}
        asset={previewAsset}
      />
    </section>
  )
}
