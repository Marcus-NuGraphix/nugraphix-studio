import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/components/marketing/')({
  component: AdminMarketingComponentsPage,
})

function AdminMarketingComponentsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Marketing Components
        </h1>
        <p className="text-sm text-muted-foreground">
          Conversion-oriented layout blocks and messaging sections used on public
          Nu Graphix pages.
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Public Experience Blocks</CardTitle>
          <CardDescription>
            Hero, narrative, and CTA components that communicate Nu Graphix
            authority and systems discipline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            This route will map reusable public components and copy patterns
            across service, portfolio, and blog journeys.
          </p>
          <p>
            Pending implementation: block registry, copy guidance, and density
            rules for responsive delivery.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
