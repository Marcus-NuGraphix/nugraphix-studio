import { Link, createFileRoute } from '@tanstack/react-router'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import {
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
  },
  {
    slug: 'workflow-automation-for-compliance',
    title: 'Workflow Automation for Compliance',
    summary:
      'Process automation architecture for audit trails, approvals, and policy enforcement.',
  },
  {
    slug: 'management-reporting-modernization',
    title: 'Management Reporting Modernization',
    summary:
      'Structured reporting layer replacing ad-hoc spreadsheet consolidation cycles.',
  },
]

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
    </MarketingContainer>
  )
}
