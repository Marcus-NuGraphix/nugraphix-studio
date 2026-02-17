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

export const Route = createFileRoute('/_public/about/')({
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('About'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Learn how Nu Graphix approaches systems architecture, implementation discipline, and long-term operational outcomes.',
        ),
      },
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <MarketingContainer>
      <MarketingHero
        badge="About Nu Graphix"
        title="We build structured systems for businesses that have outgrown manual operations."
        description="Nu Graphix exists to turn operational complexity into clear execution systems. Our work combines architecture thinking, pragmatic engineering, and disciplined delivery."
      />

      <MarketingSection
        title="What we stand for"
        description="Our delivery model is shaped by clarity, rigor, and measurable outcomes."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <MarketingCard
            meta="Clarity"
            title="No black-box delivery"
            description="You get transparent architecture decisions, scoped priorities, and visible delivery milestones."
          />
          <MarketingCard
            meta="Rigor"
            title="Engineering discipline by default"
            description="Validation, security, and quality controls are part of the build path from day one."
          />
          <MarketingCard
            meta="Pragmatism"
            title="Operational outcomes over hype"
            description="We focus on systems that reduce friction and improve decision-making in real business environments."
          />
        </div>
      </MarketingSection>

      <MarketingSection
        title="How we partner"
        description="Engagements are intentionally structured so progress is predictable and risk stays controlled."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <MarketingCard
            title="Discovery and alignment"
            description="We map your current operational flow, identify key failure points, and align on a realistic implementation sequence."
          />
          <MarketingCard
            title="Delivery and enablement"
            description="We build in tight iterations, validate assumptions early, and ensure your team can adopt and operate the system confidently."
          />
        </div>
      </MarketingSection>

      <MarketingCta
        title="Let’s map your next systems milestone."
        description="If your team is carrying process complexity in spreadsheets and inboxes, we can help you design a cleaner operational foundation."
        actions={
          <>
            <Button asChild>
              <Link to="/contact">Talk to Nu Graphix</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/services">View Services</Link>
            </Button>
          </>
        }
      />
    </MarketingContainer>
  )
}
