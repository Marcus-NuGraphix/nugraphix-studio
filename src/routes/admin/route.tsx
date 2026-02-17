import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { LayoutDashboard, LibraryBig, Settings, ShieldUser, SquareLibrary, UserCog } from 'lucide-react'
import { BrandWordmark } from '@/components/brand'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import { getOptionalSessionFn } from '@/features/auth/server/session'

const adminNavigation = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' as const },
  { icon: SquareLibrary, label: 'Content Hub', to: '/admin/content' as const },
  { icon: LibraryBig, label: 'Knowledge Base', to: '/admin/kb' as const },
  { icon: UserCog, label: 'Users', to: '/admin/users' as const },
  { icon: ShieldUser, label: 'Docs', to: '/admin/docs' as const },
  { icon: Settings, label: 'Settings', to: '/admin/settings' as const },
]

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    const session = await getOptionalSessionFn()

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
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

  return (
    <div className="bg-muted/40 text-foreground min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        <aside className="border-border bg-card hidden w-72 shrink-0 rounded-2xl border p-4 lg:block">
          <div className="mb-6 flex items-center justify-between gap-2">
            <BrandWordmark compact className="text-sm text-foreground" />
            <span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground">
              Admin
            </span>
          </div>

          <nav className="space-y-1">
            {adminNavigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeProps={{
                  className: 'bg-primary text-primary-foreground hover:bg-primary',
                }}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="border-border bg-card flex items-center justify-between rounded-2xl border p-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Nu Graphix Studio
              </p>
              <p className="truncate text-sm font-medium text-foreground">
                Signed in as {user.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" asChild>
                <Link to="/">View Public Site</Link>
              </Button>
            </div>
          </header>

          <main className="border-border bg-card min-h-[520px] rounded-2xl border p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
