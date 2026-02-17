import { Link } from '@tanstack/react-router'
import { BrandLogo, BrandWordmark } from '@/components/brand'
import { headerNavigationItems } from '@/components/navigation/site-navigation'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <BrandLogo />
            <BrandWordmark />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {headerNavigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{
                  className: 'bg-secondary text-foreground',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" className="hidden sm:inline-flex" asChild>
              <Link to="/login" search={{ redirect: undefined }}>
                Client Login
              </Link>
            </Button>
            <Button asChild>
              <Link to="/contact">Book a Strategy Call</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
