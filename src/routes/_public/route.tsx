import { Outlet, createFileRoute } from '@tanstack/react-router'
import { SiteHeader } from '@/components/navigation/site-header'

export const Route = createFileRoute('/_public')({
  component: PublicRouteLayout,
})

function PublicRouteLayout() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="flex-1">
        <SiteHeader />
        <Outlet />
      </div>
    </div>
  )
}
