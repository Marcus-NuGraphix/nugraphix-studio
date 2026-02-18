import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const formatSlug = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export const Route = createFileRoute('/admin/workspaces/content/kb/$slug')({
  component: KnowledgeBaseEntryPage,
})

function KnowledgeBaseEntryPage() {
  const { slug } = Route.useParams()
  const title = formatSlug(slug)

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title || 'Knowledge Base Entry'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Entry route scaffolded for slug: <code>{slug}</code>
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Entry Editor</CardTitle>
          <CardDescription>
            Structured notes, tagging, and internal linking UI will live here.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Pending implementation: KB editor, search indexing, and revision
          tracking.
        </CardContent>
      </Card>
    </section>
  )
}
