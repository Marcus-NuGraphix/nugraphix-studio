import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/content/posts/$id')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/admin/workspaces/content/posts/$id',
      params: { id: params.id },
    })
  },
  component: () => null,
})
