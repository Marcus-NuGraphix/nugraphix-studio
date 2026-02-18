import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/components/')({
  component: AdminComponentsPage,
})

function AdminComponentsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Component Hub
        </h1>
        <p className="text-sm text-muted-foreground">
          Systemized UI inventory for Nu Graphix Studio across primitives,
          navigation, and marketing blocks.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>UI Primitives</CardTitle>
            <CardDescription>
              Canonical shadcn-based controls under `src/components/ui`.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/admin/components/ui"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
            >
              Open primitives
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
            <CardDescription>
              Public/admin navigation shells and route access points.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/admin/components/navigation"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
            >
              Open navigation set
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Marketing</CardTitle>
            <CardDescription>
              Structured conversion-focused sections for public pages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/admin/components/marketing"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
            >
              Open marketing set
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
