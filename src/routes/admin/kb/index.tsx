import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/kb/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/workspaces/content/kb' })
  },
  component: () => null,
})
