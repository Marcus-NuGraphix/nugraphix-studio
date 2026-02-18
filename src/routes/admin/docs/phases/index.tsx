import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/docs/phases/')({
  component: AdminPhasePlaybooksPage,
})

function AdminPhasePlaybooksPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Phase Playbooks
        </h1>
        <p className="text-sm text-muted-foreground">
          Delivery execution plans used to guide Nu Graphix Studio
          implementation milestones.
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Execution Rhythm</CardTitle>
          <CardDescription>
            Each phase defines scope constraints, quality gates, and rollout
            validation checkpoints.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            This page will map active/inactive phases, progress checkpoints, and
            completion criteria for current workstreams.
          </p>
          <p>
            Pending implementation: phase status board and links to relevant
            implementation routes.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
