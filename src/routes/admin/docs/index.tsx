import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/docs/')({
  component: AdminDocsPage,
})

function AdminDocsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Architecture Docs
        </h1>
        <p className="text-sm text-muted-foreground">
          Internal documentation hub for ADRs, standards, and operational
          runbooks.
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Documentation Hub</CardTitle>
          <CardDescription>
            Route scaffold prepared for docs index, filters, and publishing
            workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Pending implementation: docs list loader, markdown/rich text
          rendering, and governance metadata.
        </CardContent>
      </Card>
    </section>
  )
}
