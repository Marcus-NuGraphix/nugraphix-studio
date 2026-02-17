import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/content/posts/$id')({
  component: EditPostPage,
})

function EditPostPage() {
  const { id } = Route.useParams()

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Edit Post
        </h1>
        <p className="text-sm text-muted-foreground">
          Post editor route scaffolded for record ID: <code>{id}</code>
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Post Editor</CardTitle>
          <CardDescription>
            This page will load post detail, revision history, and publish
            controls.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Pending implementation: CMS detail query and mutation wiring.
        </CardContent>
      </Card>
    </section>
  )
}
