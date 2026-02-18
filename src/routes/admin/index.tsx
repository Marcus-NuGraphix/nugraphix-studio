import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { adminSectionCards } from '@/components/navigation/admin/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/')({
  component: AdminHome,
})

function AdminHome() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Admin Workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          Navigate platform operations using route-aligned sections that mirror
          the current repository scaffolding.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminSectionCards.map((section) => (
          <Card key={section.to} className="border-border bg-card shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="size-4 text-primary" />
                {section.title}
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to={section.to}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
              >
                Open section
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
