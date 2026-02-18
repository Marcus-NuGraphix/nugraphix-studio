import { Outlet, createFileRoute } from '@tanstack/react-router'
import { SiteFooter } from '@/components/navigation/site-footer'
import { SiteHeader } from '@/components/navigation/site-header'
import { getOptionalSessionFn } from '@/features/auth/server/session'

export const Route = createFileRoute('/_public')({
  beforeLoad: async () => {
    const session = await getOptionalSessionFn()
    return { session }
  },
  component: PublicRouteLayout,
})

function PublicRouteLayout() {
  const { session } = Route.useRouteContext()

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div className="flex-1">
        <SiteHeader session={session} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}
