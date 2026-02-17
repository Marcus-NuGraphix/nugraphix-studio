import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/content/posts/new')({
  component: CreatePostPage,
})

function CreatePostPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create Post
        </h1>
        <p className="text-sm text-muted-foreground">
          Editor route scaffolded for the Phase 03 CMS implementation cycle.
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Editor Shell</CardTitle>
          <CardDescription>
            Title, slug, status, and rich text editor wiring will be mounted in
            this section.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Pending implementation: ProseKit editor, validation, and publish
          server functions.
        </CardContent>
      </Card>
    </section>
  )
}
