import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/kb/$slug')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/admin/workspaces/content/kb/$slug',
      params: { slug: params.slug },
    })
  },
  component: () => null,
})
