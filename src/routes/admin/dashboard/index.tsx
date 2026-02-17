import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Operational summary scaffolding for content, users, and delivery
          visibility.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Content Pipeline</CardTitle>
            <CardDescription>Draft, review, and publish throughput.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Data module wiring pending.
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>User Access</CardTitle>
            <CardDescription>Account and role management status.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Data module wiring pending.
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>Quality gate and release readiness.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Data module wiring pending.
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
