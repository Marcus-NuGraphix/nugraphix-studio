import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/workspaces/platform/docs/')({
  component: AdminDocsPage,
})

function AdminDocsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Documentation Hub
        </h1>
        <p className="text-sm text-muted-foreground">
          Centralized technical references for architecture, decision records,
          and phase execution playbooks.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Architecture</CardTitle>
            <CardDescription>
              Platform structure, boundaries, and implementation standards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/admin/workspaces/platform/docs/architecture"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
            >
              Open architecture reference
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>ADRs</CardTitle>
            <CardDescription>
              Decision history with rationale and implementation impact.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/admin/workspaces/platform/docs/adr"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
            >
              Open ADR index
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Phases</CardTitle>
            <CardDescription>
              Delivery phase plans and operational implementation checklists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/admin/workspaces/platform/docs/phases"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
            >
              Open phase playbooks
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
