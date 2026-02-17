import { Link } from '@tanstack/react-router'
import { BrandLogo, BrandWordmark } from '@/components/brand'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <BrandLogo />
            <BrandWordmark />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 lg:flex">
            <>
              <ThemeToggle />
              <Button
                // variant="outline"
                className="h-9 rounded-full border-primary/35 bg-primary px-3.5 font-semibold text-primary-foreground hover:bg-primary/65"
                asChild
              >
                <Link to="/login" search={{ redirect: undefined }}>
                  Login
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-9 rounded-full bg-accent px-3.5 font-semibold hover:bg-accent"
                asChild
              >
                <Link to="/signup" search={{ redirect: undefined }}>
                  Sign Up
                </Link>
              </Button>
            </>
          </div>
        </div>
      </div>
    </nav>
  )
}
