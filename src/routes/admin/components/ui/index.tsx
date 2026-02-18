import { createFileRoute } from '@tanstack/react-router'
import { NotificationCenter } from '@/components/feedback'
import { PageHeader } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/components/ui/')({
  component: AdminUiComponentsPage,
})

function AdminUiComponentsPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="UI Primitives"
        description="Foundation-level controls for consistent interactions and visual standards across the platform."
      />

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Primitive System</CardTitle>
          <CardDescription>
            Inputs, overlays, tables, and feedback components that power both
            marketing and admin views.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            This area will provide grouped previews, usage constraints, and
            token alignment checks for `src/components/ui/*`.
          </p>
          <p>Live demo: expandable notification surfaces built from primitives.</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Feedback Composition Example</CardTitle>
          <CardDescription>
            Token-safe notification patterns with keyboard support and reduced-motion behavior.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationCenter />
        </CardContent>
      </Card>
    </section>
  )
}
