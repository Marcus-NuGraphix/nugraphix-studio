import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import type { BlogDocJSON } from '@/features/blog/model/types'
import type { EditorStatus } from '@/components/editor/editor-shell'
import { EditorShell } from '@/components/editor/editor-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  toBlogContentText,
  toBlogPreviewParagraphs,
} from '@/features/blog/model/content'
import { ProseKitEditor } from '@/features/blog/ui/admin/prosekit-editor'

export interface BlogPostEditorFormValues {
  title: string
  slug: string
  status: EditorStatus
  contentJson: BlogDocJSON
  excerpt?: string
  coverImage?: string
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  featured: boolean
  isBreaking: boolean
}

interface BlogPostEditorFormProps {
  initialValues: BlogPostEditorFormValues
  onSave: (values: BlogPostEditorFormValues) => Promise<void>
  onPublish: (values: BlogPostEditorFormValues) => Promise<void>
  onArchive?: (values: BlogPostEditorFormValues) => Promise<void>
}

export function BlogPostEditorForm({
  initialValues,
  onSave,
  onPublish,
  onArchive,
}: BlogPostEditorFormProps) {
  const [values, setValues] = useState<BlogPostEditorFormValues>(initialValues)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)

  const contentText = useMemo(
    () => toBlogContentText(values.contentJson),
    [values.contentJson],
  )

  const previewParagraphs = useMemo(
    () => toBlogPreviewParagraphs(values.contentJson, 6),
    [values.contentJson],
  )

  const updateValue = <TKey extends keyof BlogPostEditorFormValues>(
    key: TKey,
    nextValue: BlogPostEditorFormValues[TKey],
  ) => {
    setValues((current) => ({ ...current, [key]: nextValue }))
  }

  const metadataPanel = (
    <>
      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Post Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="post-excerpt">Excerpt</Label>
            <Textarea
              id="post-excerpt"
              value={values.excerpt ?? ''}
              onChange={(event) => updateValue('excerpt', event.target.value)}
              rows={4}
              placeholder="Short post summary for listings and meta descriptions"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="post-cover-image">Cover image URL</Label>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/workspaces/content/media">
                  Open media library
                </Link>
              </Button>
            </div>
            <Input
              id="post-cover-image"
              value={values.coverImage ?? ''}
              onChange={(event) => updateValue('coverImage', event.target.value)}
              placeholder="https://cdn.example.com/post-cover.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-meta-title">Meta title</Label>
            <Input
              id="post-meta-title"
              value={values.metaTitle ?? ''}
              onChange={(event) => updateValue('metaTitle', event.target.value)}
              placeholder="SEO title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-meta-description">Meta description</Label>
            <Textarea
              id="post-meta-description"
              value={values.metaDescription ?? ''}
              onChange={(event) =>
                updateValue('metaDescription', event.target.value)
              }
              rows={3}
              placeholder="SEO description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-canonical-url">Canonical URL</Label>
            <Input
              id="post-canonical-url"
              value={values.canonicalUrl ?? ''}
              onChange={(event) =>
                updateValue('canonicalUrl', event.target.value)
              }
              placeholder="https://nugraphix.co.za/blog/article-slug"
            />
          </div>

          <div className="space-y-3 border-t border-border pt-3">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="post-featured">Featured on blog</Label>
              <Switch
                id="post-featured"
                checked={values.featured}
                onCheckedChange={(checked) =>
                  updateValue('featured', checked === true)
                }
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="post-breaking">Breaking label</Label>
              <Switch
                id="post-breaking"
                checked={values.isBreaking}
                onCheckedChange={(checked) =>
                  updateValue('isBreaking', checked === true)
                }
              />
            </div>
          </div>

          {onArchive ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isArchiving || isPublishing || isSaving}
              onClick={async () => {
                setIsArchiving(true)
                try {
                  await onArchive(values)
                } finally {
                  setIsArchiving(false)
                }
              }}
            >
              {isArchiving ? 'Archiving...' : 'Archive Post'}
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Content Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">{contentText.length} chars</Badge>
            <Badge variant="secondary">
              {contentText.split(/\s+/).filter(Boolean).length} words
            </Badge>
            <Badge variant="secondary">{values.status}</Badge>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            {previewParagraphs.length === 0 ? (
              <p>No preview text available yet.</p>
            ) : (
              previewParagraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )

  return (
    <EditorShell
      title={values.title}
      slug={values.slug}
      status={values.status}
      onTitleChange={(value) => updateValue('title', value)}
      onSlugChange={(value) => updateValue('slug', value)}
      onStatusChange={(value) => updateValue('status', value)}
      onSave={async () => {
        setIsSaving(true)
        try {
          await onSave(values)
        } finally {
          setIsSaving(false)
        }
      }}
      onPublish={async () => {
        setIsPublishing(true)
        try {
          await onPublish({ ...values, status: 'published' })
        } finally {
          setIsPublishing(false)
        }
      }}
      isSaving={isSaving}
      isPublishing={isPublishing}
      metadataPanel={metadataPanel}
    >
      <ProseKitEditor
        value={values.contentJson}
        onChange={(nextValue) => updateValue('contentJson', nextValue)}
      />
    </EditorShell>
  )
}
