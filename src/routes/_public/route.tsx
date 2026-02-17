import { Outlet, createFileRoute } from '@tanstack/react-router'
import { SiteFooter } from '@/components/navigation/site-footer'
import { SiteHeader } from '@/components/navigation/site-header'

export const Route = createFileRoute('/_public')({
  component: PublicRouteLayout,
})

function PublicRouteLayout() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div className="flex-1">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}
