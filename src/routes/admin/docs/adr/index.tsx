import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/docs/adr/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/workspaces/platform/docs/adr' })
  },
  component: () => null,
})
