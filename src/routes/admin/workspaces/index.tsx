import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/workspaces/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/workspaces/operations' })
  },
  component: () => null,
})
