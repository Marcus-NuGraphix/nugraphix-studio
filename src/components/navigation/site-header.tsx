import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogOut } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { AppSession } from '@/features/auth/model/session'
import { BrandLogo, BrandWordmark } from '@/components/brand'
import { headerNavigationItems } from '@/components/navigation/site-navigation'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import { authClient } from '@/features/auth/client/auth-client'
import { getRoleLandingPath } from '@/features/auth/model/post-auth'

interface SiteHeaderProps {
  session: AppSession | null
}

export function SiteHeader({ session }: SiteHeaderProps) {
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const isAuthenticated = Boolean(session)

  const primaryDestination = session
    ? getRoleLandingPath(session.user.role)
    : '/contact'
  const primaryLabel = session
    ? session.user.role === 'admin'
      ? 'Admin Dashboard'
      : 'Go to Blog'
    : 'Book a Strategy Call'

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
            {isAuthenticated && session ? (
              <>
                <div className="hidden min-w-0 text-right lg:block">
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="max-w-48 truncate text-xs font-medium text-foreground">
                    {session.user.email}
                  </p>
                </div>
                <Button variant="outline" className="hidden sm:inline-flex" asChild>
                  <Link to={primaryDestination}>{primaryLabel}</Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="text-sm"
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
              <>
                <Button variant="outline" className="hidden sm:inline-flex" asChild>
                  <Link to="/login" search={{ redirect: undefined }}>
                    Client Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link to={primaryDestination}>{primaryLabel}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
