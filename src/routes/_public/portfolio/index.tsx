import { Link, createFileRoute } from '@tanstack/react-router'
import type { GalleryGridImageItem } from '@/components/marketing'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import {
  GalleryGridWithLightbox,
  MarketingCard,
  MarketingContainer,
  MarketingHero,
  MarketingSection,
} from '@/components/marketing'

const portfolioEntries = [
  {
    slug: 'field-operations-control-center',
    title: 'Field Operations Control Center',
    summary:
      'Unified dispatch, ticketing, and reporting for distributed service teams.',
    category: 'Operations',
    imageSrc:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    imageAlt:
      'Operational analytics dashboard displayed across multiple charts and KPIs.',
  },
  {
    slug: 'workflow-automation-for-compliance',
    title: 'Workflow Automation for Compliance',
    summary:
      'Process automation architecture for audit trails, approvals, and policy enforcement.',
    category: 'Automation',
    imageSrc:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
    imageAlt:
      'Team reviewing workflow and compliance tasks on laptops in a meeting room.',
  },
  {
    slug: 'management-reporting-modernization',
    title: 'Management Reporting Modernization',
    summary:
      'Structured reporting layer replacing ad-hoc spreadsheet consolidation cycles.',
    category: 'Reporting',
    imageSrc:
      'https://images.unsplash.com/photo-1551281044-8b8f3c4bcb8f?auto=format&fit=crop&w=1600&q=80',
    imageAlt:
      'Executive reporting dashboard with trend charts and performance summaries.',
  },
]

const portfolioGalleryItems: Array<GalleryGridImageItem> = portfolioEntries.map(
  (entry) => ({
    id: entry.slug,
    title: entry.title,
    category: entry.category,
    imageSrc: entry.imageSrc,
    imageAlt: entry.imageAlt,
  }),
)

export const Route = createFileRoute('/_public/portfolio/')({
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Portfolio'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Selected Nu Graphix systems projects demonstrating structured delivery and operational outcomes.',
        ),
      },
    ],
  }),
  component: PortfolioPage,
})

function PortfolioPage() {
  return (
    <MarketingContainer>
      <MarketingHero
        badge="Portfolio"
        title="Systems work grounded in real operational constraints."
        description="These entries represent the style of problems we solve: process clarity, workflow control, and reporting reliability."
      />

      <MarketingSection
        title="Selected case studies"
        description="Each case study page is scaffolded for full narrative expansion and outcome evidence."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {portfolioEntries.map((entry) => (
            <Link
              key={entry.slug}
              to="/portfolio/$slug"
              params={{ slug: entry.slug }}
            >
              <MarketingCard
                meta="Case Study"
                title={entry.title}
                description={entry.summary}
                className="h-full transition-colors hover:border-primary/40"
              />
            </Link>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        title="Visual project gallery"
        description="Interactive view of representative delivery environments and workflow surfaces."
      >
        <GalleryGridWithLightbox
          items={portfolioGalleryItems}
          title="Portfolio highlights"
          description="Filter by delivery category and inspect each image in a focused lightbox."
        />
      </MarketingSection>
    </MarketingContainer>
  )
}
