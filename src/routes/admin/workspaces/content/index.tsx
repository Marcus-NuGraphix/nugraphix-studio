import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const contentWorkspaceCards = [
  {
    title: 'Content Hub',
    description: 'Editorial workflow overview and publishing controls.',
    to: '/admin/workspaces/content',
    cta: 'Open content hub',
  },
  {
    title: 'Posts',
    description: 'Manage draft, scheduled, and published posts.',
    to: '/admin/workspaces/content/posts',
    cta: 'Open posts',
  },
  {
    title: 'New Post',
    description: 'Start a new entry in the editorial pipeline.',
    to: '/admin/workspaces/content/posts/new',
    cta: 'Create post',
  },
  {
    title: 'Media',
    description: 'Upload, organize, and reuse media assets.',
    to: '/admin/workspaces/content/media',
    cta: 'Open media',
  },
  {
    title: 'Knowledge Base',
    description: 'Maintain internal docs and support content.',
    to: '/admin/workspaces/content/kb',
    cta: 'Open knowledge base',
  },
] as const

export const Route = createFileRoute('/admin/workspaces/content/')({
  component: ContentWorkspacePage,
})

function ContentWorkspacePage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Content Workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage editorial, media, and knowledge assets from a single workspace
          boundary.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {contentWorkspaceCards.map((card) => (
          <Card key={card.to} className="border-border bg-card shadow-none">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to={card.to}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
              >
                {card.cta}
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
