import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/docs/architecture/')({
  component: AdminArchitectureDocsPage,
})

function AdminArchitectureDocsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Architecture Reference
        </h1>
        <p className="text-sm text-muted-foreground">
          System architecture for Nu Graphix Studio, including routing,
          feature boundaries, and shared infrastructure standards.
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Current Focus</CardTitle>
          <CardDescription>
            Keep implementation aligned with modular feature boundaries and
            server-first security enforcement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            This section will surface architecture snapshots and route/feature
            maps derived from `ARCHITECTURE.md`.
          </p>
          <p>
            Pending implementation: docs indexing, metadata filters, and deep
            linking to architecture domains.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
