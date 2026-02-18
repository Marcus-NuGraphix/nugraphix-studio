import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { ArrowRight, Loader2, LogOut, Menu, Shield } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { AppSession } from '@/features/auth/model/session'
import { BrandLockup } from '@/components/brand'
import {
  headerNavigationItems,
  isSitePathActive,
} from '@/components/navigation/site-navigation'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { authClient } from '@/features/auth/client/auth-client'
import { getRoleLandingPath } from '@/features/auth/model/post-auth'

interface SiteHeaderProps {
  session: AppSession | null
}

export function SiteHeader({ session }: SiteHeaderProps) {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const isAuthenticated = Boolean(session)

  const primaryDestination = session
    ? getRoleLandingPath(session.user.role)
    : '/contact'
  const primaryLabel = session
    ? session.user.role === 'admin'
      ? 'Admin Dashboard'
      : 'Go to Blog'
    : 'Book a Strategy Call'
  const accountDestination = session
    ? session.user.role === 'admin'
      ? '/admin/account'
      : '/account'
    : null

  const handleSignOut = async () => {
    if (isSigningOut) {
      return
    }

    setIsSigningOut(true)

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Signed out successfully.')
          void navigate({ to: '/' })
        },
        onError: () => {
          toast.error('Unable to sign out right now. Please try again.')
        },
      },
    })

    setIsSigningOut(false)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link
            to="/"
            className="focus-visible:ring-ring/60 rounded-md focus-visible:ring-2 focus-visible:outline-none"
          >
            <BrandLockup compact className="sm:gap-3" />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {headerNavigationItems.map((item) => (
              <Button
                key={item.to}
                asChild
                variant={isSitePathActive(pathname, item) ? 'secondary' : 'ghost'}
                size="sm"
              >
                <Link to={item.to}>{item.label}</Link>
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            {isAuthenticated && session ? (
              <>
                <div className="hidden max-w-56 min-w-0 rounded-full border border-border/70 bg-muted/35 px-3 py-1.5 xl:block">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Signed in as
                  </p>
                  <p className="max-w-48 truncate text-xs font-semibold text-foreground">
                    {session.user.email}
                  </p>
                </div>
                <div className="hidden items-center gap-1.5 rounded-full border border-border/70 bg-card/80 p-1 md:flex">
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-full px-3 shadow-md shadow-primary/20"
                    asChild
                  >
                    <Link to={primaryDestination}>{primaryLabel}</Link>
                  </Button>
                  {accountDestination ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-accent/40 bg-accent/10 px-3 text-accent-foreground hover:bg-accent/20"
                      asChild
                    >
                      <Link to={accountDestination}>My Account</Link>
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="rounded-full px-3 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  >
                    {isSigningOut ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <LogOut className="size-4" />
                    )}
                    <span className="hidden lg:inline">
                      {isSigningOut ? 'Signing out...' : 'Log Out'}
                    </span>
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="md:hidden"
                  aria-label={isSigningOut ? 'Signing out' : 'Log out'}
                >
                  {isSigningOut ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <LogOut className="size-4" />
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="hidden md:inline-flex" asChild>
                  <Link to="/login" search={{ redirect: undefined }}>
                    Client Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link to={primaryDestination}>{primaryLabel}</Link>
                </Button>
              </>
            )}

            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className="lg:hidden"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] max-w-sm px-0">
                <SheetHeader className="border-border border-b px-5 pb-4">
                  <SheetTitle className="sr-only">Site Navigation</SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigate public pages and account actions.
                  </SheetDescription>
                  <BrandLockup compact />
                </SheetHeader>

                <div className="space-y-6 px-5 py-5">
                  <div className="space-y-2">
                    {headerNavigationItems.map((item) => (
                      <Button
                        key={item.to}
                        asChild
                        variant={
                          isSitePathActive(pathname, item) ? 'secondary' : 'ghost'
                        }
                        className="w-full justify-start"
                        onClick={() => setIsMobileNavOpen(false)}
                      >
                        <Link to={item.to}>{item.label}</Link>
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3">
                    <ThemeToggle showLabel className="w-full justify-start" />

                    {isAuthenticated && session ? (
                      <>
                        <p className="text-xs text-muted-foreground">
                          Signed in as
                          <span className="mt-0.5 block font-medium text-foreground">
                            {session.user.email}
                          </span>
                        </p>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link
                            to={primaryDestination}
                            onClick={() => setIsMobileNavOpen(false)}
                          >
                            <Shield className="size-4" />
                            {primaryLabel}
                          </Link>
                        </Button>
                        {accountDestination ? (
                          <Button
                            variant="secondary"
                            className="w-full justify-start"
                            asChild
                          >
                            <Link
                              to={accountDestination}
                              onClick={() => setIsMobileNavOpen(false)}
                            >
                              My Account
                            </Link>
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsMobileNavOpen(false)
                            void handleSignOut()
                          }}
                          disabled={isSigningOut}
                        >
                          {isSigningOut ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <LogOut className="size-4" />
                          )}
                          {isSigningOut ? 'Signing out...' : 'Log Out'}
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full" asChild>
                          <Link
                            to="/login"
                            search={{ redirect: undefined }}
                            onClick={() => setIsMobileNavOpen(false)}
                          >
                            Client Login
                          </Link>
                        </Button>
                        <Button className="w-full" asChild>
                          <Link
                            to={primaryDestination}
                            onClick={() => setIsMobileNavOpen(false)}
                          >
                            {primaryLabel}
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
