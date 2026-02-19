import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { AdminSidebar } from '@/components/navigation/admin/admin-sidebar'
import {
  adminQuickAccessLinks,
  adminWorkspaceLinks,
  getAdminBreadcrumbs,
  getAdminWorkspaceFromPath,
  isAdminPathActive,
} from '@/components/navigation/admin/navigation'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { authClient } from '@/features/auth/client/auth-client'
import { toSafeRedirectPath } from '@/features/auth/model/redirect'
import { getOptionalSessionFn } from '@/features/auth/server/session'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    const session = await getOptionalSessionFn()

    if (!session) {
      const locationHref = location.href
      const redirectPath = (() => {
        try {
          const parsed = new URL(locationHref)
          return `${parsed.pathname}${parsed.search}${parsed.hash}` || '/admin'
        } catch {
          return toSafeRedirectPath(locationHref, '/admin')
        }
      })()

      throw redirect({
        to: '/login',
        search: { redirect: toSafeRedirectPath(redirectPath, '/admin') },
      })
    }

    if (session.user.role !== 'admin') {
      throw redirect({ to: '/' })
    }

    return { user: session.user }
  },
  component: AdminRouteComponent,
})

function AdminRouteComponent() {
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [isSigningOut, setIsSigningOut] = useState(false)
  const breadcrumbs = getAdminBreadcrumbs(pathname)
  const activeWorkspace = getAdminWorkspaceFromPath(pathname)

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
    <SidebarProvider className="bg-muted/40 text-foreground min-h-screen">
      <AdminSidebar
        user={user}
        isSigningOut={isSigningOut}
        onSignOut={handleSignOut}
      />
      <SidebarInset>
        <header className="border-border bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
          <div className="flex h-16 items-center gap-2 px-4 sm:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-1 data-[orientation=vertical]:h-4"
            />
            <nav
              aria-label="Admin breadcrumbs"
              className="flex min-w-0 items-center gap-1 text-sm"
            >
              <Link
                to="/admin/workspaces/operations"
                className="text-muted-foreground truncate hover:text-foreground"
              >
                Admin
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <div
                  key={`${crumb.label}-${index}`}
                  className="flex min-w-0 items-center gap-1"
                >
                  <span className="text-muted-foreground">/</span>
                  {crumb.to ? (
                    <Link
                      to={crumb.to}
                      className="text-muted-foreground truncate hover:text-foreground"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="truncate font-medium text-foreground">
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
            <nav
              aria-label="Workspace switcher"
              className="ml-2 hidden items-center gap-1 lg:flex"
            >
              {adminWorkspaceLinks.map((workspace) => (
                <Link
                  key={workspace.id}
                  to={workspace.to}
                  className={cn(
                    'rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
                    activeWorkspace === workspace.id &&
                      'bg-secondary text-foreground',
                  )}
                >
                  {workspace.title}
                </Link>
              ))}
            </nav>
            <div className="ml-auto hidden items-center gap-1 xl:flex">
              {adminQuickAccessLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
                    isAdminPathActive(pathname, item.to) &&
                      'bg-secondary text-foreground',
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" asChild>
                <Link to="/">View Public Site</Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col p-4 sm:p-6">
          <div className="border-border bg-card min-h-[calc(100vh-7.5rem)] rounded-2xl border p-6">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
