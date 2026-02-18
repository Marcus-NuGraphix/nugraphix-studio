import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/workspaces/platform/docs/adr/')({
  component: AdminAdrIndexPage,
})

function AdminAdrIndexPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Architecture Decision Records
        </h1>
        <p className="text-sm text-muted-foreground">
          Decision ledger for platform architecture, standards, and implementation
          trade-offs.
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Decision Governance</CardTitle>
          <CardDescription>
            Track accepted decisions and identify superseded guidance before
            implementation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            This route will render ADR metadata, chronological decision history,
            and status visibility for implementation teams.
          </p>
          <p>
            Pending implementation: parsed ADR index, search/filter controls,
            and cross-linking to affected routes/features.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
