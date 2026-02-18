import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/workspaces/operations/settings/')({
  component: AdminSettingsPage,
})

function AdminSettingsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          System Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Configuration and policy controls for Nu Graphix Studio.
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Settings scaffold</CardTitle>
          <CardDescription>
            Route ready for environment configuration, security policy
            management, and notification controls.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Pending implementation: validated settings schema and admin mutation
          handlers.
        </CardContent>
      </Card>
    </section>
  )
}
