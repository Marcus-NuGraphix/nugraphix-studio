import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/components/navigation/')({
  component: AdminNavigationComponentsPage,
})

function AdminNavigationComponentsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Navigation Components
        </h1>
        <p className="text-sm text-muted-foreground">
          Route and shell navigation surfaces for public pages and internal
          tooling workflows.
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Navigation Architecture</CardTitle>
          <CardDescription>
            Maintain consistent wayfinding patterns across `src/routes` and
            `src/components/navigation`.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            This section will document menu structures, route group boundaries,
            and active-state behavior for desktop/mobile navigation.
          </p>
          <p>
            Pending implementation: navigation inventory and UX regression
            checks for route changes.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
