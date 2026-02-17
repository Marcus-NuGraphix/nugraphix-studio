import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BookOpenText } from 'lucide-react'
import { EmptyState } from '@/components/empties/empty-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/kb/')({
  component: KnowledgeBasePage,
})

function KnowledgeBasePage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Knowledge Base
        </h1>
        <p className="text-sm text-muted-foreground">
          Internal systems notes and reusable architecture patterns.
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Entries</CardTitle>
          <CardDescription>
            Knowledge base list scaffolding is ready for search and entry
            management.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EmptyState
            icon={BookOpenText}
            title="Knowledge base list wiring pending"
            description="Connect list/get/create/update routes for KB entries."
          />
          <Link
            to="/admin/kb/$slug"
            params={{ slug: 'first-entry' }}
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
          >
            Open entry scaffold
            <ArrowRight className="size-4" />
          </Link>
        </CardContent>
      </Card>
    </section>
  )
}
