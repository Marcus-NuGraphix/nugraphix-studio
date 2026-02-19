import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/docs/phases/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/workspaces/platform/docs/phases' })
  },
  component: () => null,
})
