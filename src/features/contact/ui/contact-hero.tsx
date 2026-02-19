import { brandConfig } from '@/components/brand'
import { MarketingHero } from '@/components/marketing'

export function ContactHero() {
  return (
    <MarketingHero
      badge="Contact Nu Graphix"
      title="Start with a structured discovery conversation."
      description="Share your operational goals, constraints, and delivery timeline. We will map the highest-impact system opportunities and propose a practical implementation path."
      actions={
        <p className="text-sm text-muted-foreground">
          Response channel: {brandConfig.contactEmail}
        </p>
      }
    />
  )
}
