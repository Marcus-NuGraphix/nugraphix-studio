import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/components/ui/')({
  component: AdminUiComponentsPage,
})

function AdminUiComponentsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          UI Primitives
        </h1>
        <p className="text-sm text-muted-foreground">
          Foundation-level controls for consistent interactions and visual
          standards across the platform.
        </p>
      </header>

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
          <p>
            Pending implementation: component matrix, accessibility checklist,
            and variant documentation.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
