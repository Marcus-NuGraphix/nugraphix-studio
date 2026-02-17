import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, FileText } from 'lucide-react'
import { EmptyState } from '@/components/empties/empty-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/content/posts/')({
  component: ContentPostsPage,
})

function ContentPostsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Posts
        </h1>
        <p className="text-sm text-muted-foreground">
          Post list route scaffolded for table integration and publishing
          controls.
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Editorial List</CardTitle>
          <CardDescription>
            Connect this page to CMS query functions and status filters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EmptyState
            icon={FileText}
            title="No posts wired yet"
            description="Integrate post list server functions and table components."
          />
          <Link
            to="/admin/content/posts/new"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
          >
            Create a new post
            <ArrowRight className="size-4" />
          </Link>
        </CardContent>
      </Card>
    </section>
  )
}
