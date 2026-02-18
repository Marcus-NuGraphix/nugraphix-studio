import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Newspaper, Sparkles } from 'lucide-react'
import type { BlogPublicPostListItem } from '@/features/blog'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import {
  CardSlider,
  MarketingContainer,
  MarketingHero,
  MarketingSection,
  NewsFeed,
} from '@/components/marketing'
import { Button } from '@/components/ui/button'
import {
  PublicBlogCard,
  blogPublicPostFiltersSchema,
  demoPublicBlogPostListItems,
  getPublicBlogPostsFn,
} from '@/features/blog'
import { EmailSubscribeCard } from '@/features/email'

const blogSearchSchema = blogPublicPostFiltersSchema.partial()

export const Route = createFileRoute('/_public/blog/')({
  validateSearch: (search) => blogSearchSchema.parse(search),
  loaderDeps: ({ search }) => blogPublicPostFiltersSchema.parse(search),
  loader: async ({ deps }) => {
    try {
      return await getPublicBlogPostsFn({ data: deps })
    } catch (error) {
      if (error instanceof Response) throw error
      return {
        posts: [],
        total: 0,
        page: deps.page,
        pageSize: deps.pageSize,
        totalPages: 1,
        filters: deps,
      }
    }
  },
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Blog'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Nu Graphix perspectives on systems architecture, full-stack delivery, and operational software design.',
        ),
      },
    ],
  }),
  component: BlogIndexPage,
})

function BlogIndexPage() {
  const data = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const useDemoPosts = data.posts.length === 0 && !data.filters.query
  const posts = useDemoPosts ? demoPublicBlogPostListItems : data.posts
  const featuredPosts = posts.filter((post) => post.featured).slice(0, 6)
  const sliderPosts = featuredPosts.length > 0 ? featuredPosts : posts.slice(0, 6)
  const publishedCount = posts.length
  const latestPostDate = posts.at(0)?.publishedAt ?? null
  const newsFeedItems = posts.slice(0, 8).map((post) => toNewsFeedItem(post))

  return (
    <MarketingContainer>
      <MarketingHero
        className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/12"
        badge="Insights"
        eyebrow="Nu Graphix Editorial Desk"
        title="Build smarter systems with practical engineering insight."
        description="Our writing focuses on architecture decisions, delivery patterns, and operational software strategy for growing businesses."
        actions={
          <>
            <Button asChild size="lg" className="shadow-lg shadow-primary/25">
              <a href="#latest-posts">Read latest posts</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-accent/40 bg-accent/10 text-foreground hover:bg-accent/20"
            >
              <a href="#release-updates">Subscribe to updates</a>
            </Button>
          </>
        }
        supportingPanel={
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Editorial stats
            </p>
            <div className="space-y-2 rounded-xl border border-border/80 bg-background/85 p-3">
              <p className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Newspaper className="size-4 text-primary" />
                  Published posts
                </span>
                <span className="font-semibold text-foreground">{publishedCount}</span>
              </p>
              <p className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="size-4 text-accent" />
                  Featured dispatches
                </span>
                <span className="font-semibold text-foreground">{sliderPosts.length}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {latestPostDate
                  ? `Latest publish: ${latestPostDate.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}`
                  : 'Latest publish date will appear after first release.'}
              </p>
            </div>
          </div>
        }
      />

      {sliderPosts.length > 0 ? (
        <MarketingSection
          title="Featured dispatches"
          description="Curated long-form posts selected for strategic architecture and delivery relevance."
        >
          <CardSlider
            ariaLabel="Featured blog posts"
            items={sliderPosts.map((post) => ({
              id: post.id,
              content: <PublicBlogCard post={post} className="h-full" />,
            }))}
          />
        </MarketingSection>
      ) : null}

      {newsFeedItems.length > 0 ? (
        <MarketingSection
          title="Latest updates"
          description="Filter quick editorial summaries before opening a full article."
        >
          <NewsFeed
            items={newsFeedItems}
            onOpenItem={(item) =>
              void navigate({
                to: '/blog/$slug',
                params: { slug: item.id },
              })
            }
          />
        </MarketingSection>
      ) : null}

      <div id="latest-posts">
        <MarketingSection
          title="Latest posts"
          description="Published editorial insights from Nu Graphix Studio."
        >
          {useDemoPosts ? (
            <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 text-sm text-muted-foreground">
              No published posts are available yet, so demo articles are shown to preview the public blog experience.
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
              No posts match the current filters.
            </div>
          ) : null}

          {posts.length > 0 ? (
            <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <PublicBlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : null}
        </MarketingSection>
      </div>

      {!useDemoPosts && data.posts.length > 0 ? (
        <div className="flex items-center justify-end gap-2 rounded-2xl border border-border/80 bg-card/60 p-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={data.page <= 1}
            onClick={() =>
              navigate({
                to: '/blog',
                search: (prev) => ({ ...prev, page: Math.max(1, data.page - 1) }),
              })
            }
          >
            Previous
          </Button>
          <p className="px-2 text-xs text-muted-foreground">
            Page {data.page} / {data.totalPages}
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-accent/35 bg-accent/10 text-foreground hover:bg-accent/20"
            disabled={data.page >= data.totalPages}
            onClick={() =>
              navigate({
                to: '/blog',
                search: (prev) => ({ ...prev, page: data.page + 1 }),
              })
            }
          >
            Next
          </Button>
        </div>
      ) : null}

      <div id="release-updates">
        <MarketingSection
          title="Subscribe for release updates"
          description="Receive practical system architecture insights and product updates from Nu Graphix."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <EmailSubscribeCard
              title="Newsroom Briefing"
              description="Weekly engineering notes and architecture insights."
              topic="blog"
            />
            <EmailSubscribeCard
              title="Product Announcements"
              description="Platform releases, delivery improvements, and capabilities updates."
              topic="product"
            />
          </div>
        </MarketingSection>
      </div>

      <div className="rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-accent/10 to-card p-5 text-sm text-muted-foreground">
        Stay current with architecture and delivery practices from Nu Graphix Studio.{' '}
        <Button asChild size="sm" variant="link" className="h-auto p-0 text-primary">
          <Link to="/contact">
            Book a strategy call
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </MarketingContainer>
  )
}

const toNewsFeedItem = (post: BlogPublicPostListItem) => ({
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
