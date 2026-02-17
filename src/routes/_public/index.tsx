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

export const Route = createFileRoute('/_public/')({
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Structured Digital Systems'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Nu Graphix designs and builds structured digital systems that replace manual operations and improve decision clarity.',
        ),
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  return (
    <MarketingContainer>
      <MarketingHero
        badge="Nu Graphix Studio"
        title="Structured digital systems for operationally complex businesses."
        description="We design and deploy practical software systems that replace spreadsheet dependency, reduce process friction, and give leaders reliable operational visibility."
        actions={
          <>
            <Button asChild>
              <Link to="/contact">Book a Strategy Call</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/services">Explore Services</Link>
            </Button>
          </>
        }
      />

      <MarketingSection
        title="What we deliver"
        description="Every engagement is outcome-first: clearer process flow, stronger reporting, and software that fits operational reality."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <MarketingCard
            meta="Architecture"
            title="Operational Systems Architecture"
            description="We map and redesign your workflows into a clear systems model with real ownership boundaries."
          />
          <MarketingCard
            meta="Implementation"
            title="Custom Platform Development"
            description="We build full-stack applications that replace brittle manual handling with durable process control."
          />
          <MarketingCard
            meta="Visibility"
            title="Reporting and Decision Clarity"
            description="We structure your data model and reporting layer so teams can act on reliable operational insight."
          />
        </div>
      </MarketingSection>

      <MarketingSection
        title="How we work"
        description="A disciplined implementation flow keeps risk controlled and delivery consistent."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <MarketingCard
            meta="Step 1"
            title="Audit and Blueprint"
            description="We identify process bottlenecks, dependency risk, and data gaps before writing production code."
          />
          <MarketingCard
            meta="Step 2"
            title="Build and Validate"
            description="We deliver features in focused increments with security, observability, and quality gates in place."
          />
          <MarketingCard
            meta="Step 3"
            title="Operational Adoption"
            description="We align your team around the new system so process quality improves and results compound."
          />
        </div>
      </MarketingSection>

      <MarketingCta
        title="Ready to replace operational chaos with structured execution?"
        description="Start with a focused planning conversation. We will map your current state, identify the highest-impact system opportunities, and define a practical build path."
        actions={
          <>
            <Button asChild>
              <Link to="/contact">Start the Conversation</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/about">Learn About Nu Graphix</Link>
            </Button>
          </>
        }
      />
    </MarketingContainer>
  )
}
