import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: AdminHome,
})

function AdminHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
    </div>
  )
}
