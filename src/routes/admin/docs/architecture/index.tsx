import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/docs/architecture/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/workspaces/platform/docs/architecture' })
  },
  component: () => null,
})
