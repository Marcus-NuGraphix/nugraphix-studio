import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/components/ui/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/workspaces/platform/components/ui' })
  },
  component: () => null,
})
