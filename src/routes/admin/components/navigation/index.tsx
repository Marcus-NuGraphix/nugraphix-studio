import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/components/navigation/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/workspaces/platform/components/navigation' })
  },
  component: () => null,
})
