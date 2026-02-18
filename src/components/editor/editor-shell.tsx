import { Loader2, WandSparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn, generateSlug } from '@/lib/utils'

export const editorStatusValues = [
  'draft',
  'scheduled',
  'published',
  'archived',
] as const

export type EditorStatus = (typeof editorStatusValues)[number]

interface EditorShellProps {
  title: string
  slug: string
  status: EditorStatus
  onTitleChange: (value: string) => void
  onSlugChange: (value: string) => void
  onStatusChange: (value: EditorStatus) => void
  onSave?: () => void
  onPublish?: () => void
  isSaving?: boolean
  isPublishing?: boolean
  metadataPanel?: ReactNode
  children: ReactNode
  className?: string
}

export function EditorShell({
  title,
  slug,
  status,
  onTitleChange,
  onSlugChange,
  onStatusChange,
  onSave,
  onPublish,
  isSaving = false,
  isPublishing = false,
  metadataPanel,
  children,
  className,
}: EditorShellProps) {
  const isMobile = useIsMobile()

  return (
    <section className={cn('space-y-6', className)}>
      <Card className="border-border bg-card shadow-none">
        <CardHeader className="space-y-2">
          <CardTitle>Editor Controls</CardTitle>
          <CardDescription>
            Manage document identity and publication status before saving.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="editor-title">Title</Label>
              <Input
                id="editor-title"
                value={title}
                onChange={(event) => onTitleChange(event.target.value)}
                placeholder="Enter content title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editor-status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => onStatusChange(value as EditorStatus)}
              >
                <SelectTrigger id="editor-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {editorStatusValues.map((statusValue) => (
                    <SelectItem key={statusValue} value={statusValue}>
                      {statusValue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="editor-slug">Slug</Label>
              <Input
                id="editor-slug"
                value={slug}
                onChange={(event) => onSlugChange(event.target.value)}
                placeholder="content-slug"
              />
            </div>

            <Button
              variant="outline"
              type="button"
              onClick={() =>
                onSlugChange(generateSlug(title, { fallback: 'untitled' }))
              }
            >
              <WandSparkles className="size-4" />
              Generate slug
            </Button>
          </div>

          <div
            className={cn(
              'flex items-center gap-2',
              isMobile ? 'flex-col' : 'justify-end',
            )}
          >
            <Button
              variant="outline"
              type="button"
              onClick={onSave}
              disabled={!onSave || isSaving || isPublishing}
              className={cn(isMobile && 'w-full')}
            >
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={onPublish}
              disabled={!onPublish || isPublishing || isSaving}
              className={cn(isMobile && 'w-full')}
            >
              {isPublishing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>

      <div
        className={cn(
          'grid gap-6',
          metadataPanel ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : 'grid-cols-1',
        )}
      >
        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Editor Surface</CardTitle>
            <CardDescription>
              Mount rich-text or structured editing controls in this panel.
            </CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>

        {metadataPanel ? (
          <aside className="space-y-4">{metadataPanel}</aside>
        ) : null}
      </div>
    </section>
  )
}
