import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/content/')({
  component: ContentHubPage,
})

function ContentHubPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Content Hub
        </h1>
        <p className="text-sm text-muted-foreground">
          CMS route scaffolding for posts, publishing workflow, and content
          management controls.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            <CardDescription>
              Manage draft and published editorial content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/admin/content/posts"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
            >
              Open post list
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>
              Start a new content entry for publishing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/admin/content/posts/new"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
            >
              Open editor scaffold
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
