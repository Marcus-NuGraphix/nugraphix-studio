import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/content/posts/new')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/workspaces/content/posts/new' })
  },
  component: () => null,
})
