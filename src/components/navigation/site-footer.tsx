import { Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import { BrandLockup, brandConfig } from '@/components/brand'
import { quickNavigationLinks } from '@/components/navigation/site-navigation'

const socialLabels = {
  x: 'X',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
} as const

type SocialLabelKey = keyof typeof socialLabels

export function SiteFooter() {
  const year = new Date().getFullYear()
  const socialLinks = Object.entries(brandConfig.social).filter(
    (entry): entry is [SocialLabelKey, string] => {
      const [key, value] = entry
      return Object.prototype.hasOwnProperty.call(socialLabels, key) && Boolean(value)
    },
  )

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl space-y-3">
            <BrandLockup compact />
            <p className="text-sm leading-6 text-muted-foreground">
              {brandConfig.tagline}
            </p>
            <p className="text-sm text-muted-foreground/90">
              Contact: {brandConfig.contactEmail}
            </p>
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {socialLinks.map(([network, href]) => (
                  <a
                    key={network}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                  >
                    {socialLabels[network]}
                    <ExternalLink className="size-3" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {quickNavigationLinks.map((item) => (
              <span key={item.to} className="inline-flex">
                <Link
                  to={item.to}
                  className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-1 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brandConfig.companyName}. All rights reserved.
          </p>
          <p className="text-muted-foreground/80">
            {brandConfig.serviceName} · {brandConfig.dashboardSubLabel}
          </p>
        </div>
      </div>
    </footer>
  )
}
