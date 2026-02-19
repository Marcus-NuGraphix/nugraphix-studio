import { brandConfig } from '@/components/brand'
import { MarketingContainer, MarketingSection } from '@/components/marketing'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/features/contact/ui/contact-form'
import { ContactHero } from '@/features/contact/ui/contact-hero'

export function ContactPage() {
  return (
    <MarketingContainer className="space-y-8">
      <ContactHero />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ContactForm />

        <aside className="space-y-4">
          <Card className="border-border bg-card shadow-none">
            <CardHeader>
              <CardTitle>What happens next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>1. We review your current process and technical context.</p>
              <p>2. We schedule a focused discovery call.</p>
              <p>
                3. We propose a structured architecture and delivery sequence.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-secondary shadow-none">
            <CardHeader>
              <CardTitle>Direct contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Email: {brandConfig.contactEmail}</p>
              <p>
                We prioritize inquiries that include timeline, business context,
                and operational constraints.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      <MarketingSection
        title="Discovery-ready submissions move fastest"
        description="Include the systems you currently use, your top process bottlenecks, and the decision outcomes you want to improve."
      >
        <Card className="border-border bg-card shadow-none">
          <CardContent className="pt-6 text-sm leading-7 text-muted-foreground">
            Clear input helps us align architecture recommendations quickly and
            reduce back-and-forth during scoping.
          </CardContent>
        </Card>
      </MarketingSection>
    </MarketingContainer>
  )
}
