import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/docs/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/workspaces/platform/docs' })
  },
  component: () => null,
})
