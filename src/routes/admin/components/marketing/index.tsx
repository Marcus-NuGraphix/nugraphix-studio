import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/components/marketing/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/workspaces/platform/components/marketing' })
  },
  component: () => null,
})
