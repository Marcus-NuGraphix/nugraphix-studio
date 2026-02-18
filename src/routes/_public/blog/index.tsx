import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import {
  MarketingCard,
  MarketingContainer,
  MarketingHero,
  MarketingSection,
} from '@/components/marketing'
import { EmailSubscribeCard } from '@/features/email'

const blogPlaceholders = [
  {
    slug: 'system-architecture-for-smes',
    title: 'System Architecture for Operational SMEs',
    summary:
      'A practical model for moving from fragmented tools to a coherent operational platform.',
  },
  {
    slug: 'how-to-reduce-reporting-chaos',
    title: 'How to Reduce Reporting Chaos',
    summary:
      'A field guide for turning inconsistent reporting into decision-grade operational visibility.',
  },
  {
    slug: 'from-service-work-to-product-thinking',
    title: 'From Service Delivery to Product Thinking',
    summary:
      'How consultancy teams can extract repeatable patterns and build SaaS-ready foundations.',
  },
]

export const Route = createFileRoute('/_public/blog/')({
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
  return (
    <MarketingContainer>
      <MarketingHero
        badge="Insights"
        title="Build smarter systems with practical engineering insight."
        description="Our writing focuses on architecture decisions, delivery patterns, and operational software strategy for growing businesses."
      />

      <MarketingSection
        title="Latest posts"
        description="These scaffold entries establish structure for the first publishing cycle."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {blogPlaceholders.map((post) => (
            <Link key={post.slug} to="/blog/$slug" params={{ slug: post.slug }}>
              <MarketingCard
                meta="Article"
                title={post.title}
                description={post.summary}
                className="h-full transition-colors hover:border-primary/40"
              />
            </Link>
          ))}
        </div>
      </MarketingSection>

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
        Editorial publishing workflows are being wired next. Use any article to
        preview route structure and page templates.{' '}
        <ArrowRight className="inline size-4 align-[-2px]" />
      </div>
    </MarketingContainer>
  )
}
