import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminRouteComponent,
})

function AdminRouteComponent() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
