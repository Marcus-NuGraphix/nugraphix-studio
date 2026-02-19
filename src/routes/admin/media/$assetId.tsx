import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/media/$assetId')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/admin/workspaces/content/media/$assetId',
      params: { assetId: params.assetId },
    })
  },
  component: () => null,
})
