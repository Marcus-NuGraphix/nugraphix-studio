import { Link } from '@tanstack/react-router'
import { BrandWordmark, brandConfig } from '@/components/brand'
import { quickNavigationLinks } from '@/components/navigation/site-navigation'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl space-y-2">
            <BrandWordmark compact className="text-base text-foreground" />
            <p className="text-sm leading-6 text-muted-foreground">
              {brandConfig.tagline}
            </p>
            <p className="text-sm text-muted-foreground">
              Contact: {brandConfig.contactEmail}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-3">
            {quickNavigationLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/privacy-policy"
              className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>

        <div className="border-t border-border pt-4 text-xs text-muted-foreground">
          © {year} {brandConfig.companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
