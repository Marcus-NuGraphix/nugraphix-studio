import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/workspaces/platform/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/workspaces/platform/docs' })
  },
  component: () => null,
})
