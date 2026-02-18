import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users/$userId')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/admin/workspaces/operations/users/$userId',
      params: { userId: params.userId },
    })
  },
  component: () => null,
})
