import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import {
  MarketingCard,
  MarketingContainer,
  MarketingHero,
  MarketingSection,
} from '@/components/marketing'
import {
  blogPublicPostFiltersSchema,
  getPublicBlogPostsFn,
} from '@/features/blog'
import { EmailSubscribeCard } from '@/features/email'

const blogSearchSchema = blogPublicPostFiltersSchema.partial()

export const Route = createFileRoute('/_public/blog/')({
  validateSearch: (search) => blogSearchSchema.parse(search),
  loaderDeps: ({ search }) => blogPublicPostFiltersSchema.parse(search),
  loader: async ({ deps }) => getPublicBlogPostsFn({ data: deps }),
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

  return (
    <MarketingContainer>
      <MarketingHero
        badge="Insights"
        title="Build smarter systems with practical engineering insight."
        description="Our writing focuses on architecture decisions, delivery patterns, and operational software strategy for growing businesses."
      />

      <MarketingSection
        title="Latest posts"
        description="Published editorial insights from Nu Graphix Studio."
      >
        {data.posts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            No posts are published yet. Check back soon for new insights.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {data.posts.map((post) => (
              <Link key={post.slug} to="/blog/$slug" params={{ slug: post.slug }}>
                <MarketingCard
                  meta={`Article · ${post.readingTimeMinutes} min read`}
                  title={post.title}
                  description={post.excerpt ?? 'Read the latest Nu Graphix editorial update.'}
                  className="h-full transition-colors hover:border-primary/40"
                />
              </Link>
            ))}
          </div>
        )}
      </MarketingSection>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          className="text-sm text-muted-foreground disabled:opacity-50"
          disabled={data.page <= 1}
          onClick={() =>
            navigate({
              to: '/blog',
              search: (prev) => ({ ...prev, page: Math.max(1, data.page - 1) }),
            })
          }
        >
          Previous
        </button>
        <p className="text-xs text-muted-foreground">
          Page {data.page} / {data.totalPages}
        </p>
        <button
          type="button"
          className="text-sm text-muted-foreground disabled:opacity-50"
          disabled={data.page >= data.totalPages}
          onClick={() =>
            navigate({
              to: '/blog',
              search: (prev) => ({ ...prev, page: data.page + 1 }),
            })
          }
        >
          Next
        </button>
      </div>

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

      <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Stay current with architecture and delivery practices from Nu Graphix Studio.
        <ArrowRight className="ml-1 inline size-4 align-[-2px]" />
      </div>
    </MarketingContainer>
  )
}
