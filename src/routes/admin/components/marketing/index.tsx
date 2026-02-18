import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { NewsFeedItem } from '@/components/marketing'
import type { BlogPublicPostListItem } from '@/features/blog'
import { NewsFeed } from '@/components/marketing'
import { PageHeader } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  demoPublicBlogPostListItems,
  getPublicBlogPostsFn,
} from '@/features/blog'
import {
  copyToClipboard,
  nativeShare,
} from '@/lib/utils'

interface AdminMarketingComponentsLoaderData {
  posts: Array<BlogPublicPostListItem>
}

export const Route = createFileRoute('/admin/components/marketing/')({
  loader: async (): Promise<AdminMarketingComponentsLoaderData> => {
    try {
      const result = await getPublicBlogPostsFn({
        data: {
          page: 1,
          pageSize: 8,
        },
      })

      return {
        posts:
          result.posts.length > 0 ? result.posts : demoPublicBlogPostListItems,
      }
    } catch (error) {
      if (error instanceof Response) throw error
      return {
        posts: demoPublicBlogPostListItems,
      }
    }
  },
  component: AdminMarketingComponentsPage,
})

function AdminMarketingComponentsPage() {
  const data = Route.useLoaderData()
  const items: Array<NewsFeedItem> = data.posts.map(toNewsFeedItem)

  return (
    <section className="space-y-6">
      <PageHeader
        title="Marketing Components"
        description="Conversion-oriented layout blocks and messaging sections used on public Nu Graphix pages."
      />

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
            This feed is now wired to published blog data with live filtering.
          </p>
          <p>
            Share actions use native share when available and fall back to
            clipboard copy.
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>News Feed Composition</CardTitle>
          <CardDescription>
            Production data-backed marketing feed based on public editorial
            posts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewsFeed
            items={items}
            onOpenItem={(item) => {
              window.open(`/blog/${item.id}`, '_blank', 'noopener,noreferrer')
            }}
            onShareItem={async (item) => {
              const url = `${window.location.origin}/blog/${item.id}`
              const shared = await nativeShare({
                title: item.title,
                description: item.summary,
                url,
              })

              if (shared) {
                toast.success('Article shared.')
                return
              }

              const copied = await copyToClipboard(url)
              if (copied) {
                toast.success('Article URL copied to clipboard.')
                return
              }

              toast.error('Unable to share this article right now.')
            }}
          />
        </CardContent>
      </Card>
    </section>
  )
}

const toNewsFeedItem = (post: BlogPublicPostListItem): NewsFeedItem => ({
  id: post.slug,
  title: post.title,
  summary: post.excerpt ?? 'Editorial summary will be available after publishing.',
  category: post.featured ? 'Featured' : 'Editorial',
  publishedLabel: post.publishedAt.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
  readTimeLabel: `${post.readingTimeMinutes} min read`,
  author: {
    name: 'Nu Graphix Editorial',
    role: post.featured ? 'Featured dispatch' : 'Editorial desk',
  },
  trending: post.featured,
})
