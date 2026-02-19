import { Link, createFileRoute } from '@tanstack/react-router'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import {
  MarketingCard,
  MarketingContainer,
  MarketingCta,
  MarketingHero,
  MarketingSection,
} from '@/components/marketing'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_public/services/')({
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Services'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Nu Graphix consulting and engineering services for operational systems architecture, implementation, and modernization.',
        ),
      },
    ],
  }),
  component: ServicesPage,
})

function ServicesPage() {
  return (
    <MarketingContainer>
      <MarketingHero
        badge="Services"
        title="System architecture and full-stack implementation for operational teams."
        description="We support businesses from architecture strategy through implementation and optimization, with a strong focus on maintainable execution."
      />

      <MarketingSection
        title="Core service tracks"
        description="Choose a focused engagement track or combine them for end-to-end delivery."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <MarketingCard
            meta="Track 1"
            title="Systems Architecture"
            description="Process mapping, technical architecture, delivery sequencing, and technical risk analysis."
          />
          <MarketingCard
            meta="Track 2"
            title="Platform Build Delivery"
            description="Custom full-stack applications, admin workflows, integration surfaces, and secure deployment paths."
          />
          <MarketingCard
            meta="Track 3"
            title="Operational Optimization"
            description="Refinement cycles focused on reporting fidelity, workflow resilience, and system adoption maturity."
          />
        </div>
      </MarketingSection>

      <MarketingSection
        title="Typical outcomes"
        description="Most engagements target a small set of operational outcomes with compounding value."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <MarketingCard
            title="Reduced manual handling"
            description="Structured process flows replace repeated rework, inbox dependencies, and fragmented handoffs."
          />
          <MarketingCard
            title="Decision-grade reporting"
            description="Leaders move from uncertain spreadsheet snapshots to consistent, trusted operational visibility."
          />
          <MarketingCard
            title="Controlled delivery cadence"
            description="Teams work in traceable increments with explicit scope boundaries and lower implementation risk."
          />
          <MarketingCard
            title="SaaS-ready foundations"
            description="Architecture decisions remain flexible for future productization without premature complexity."
          />
        </div>
      </MarketingSection>

      <MarketingCta
        title="Need a systems partner for your next build cycle?"
        description="Share your current constraints and we will propose a structured path from architecture to implementation."
        actions={
          <>
            <Button asChild>
              <Link to="/contact">Request a Consultation</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/portfolio">Review Portfolio Direction</Link>
            </Button>
          </>
        }
      />
    </MarketingContainer>
  )
}
