import { createFileRoute, redirect } from '@tanstack/react-router'
import { mediaAssetFiltersSchema } from '@/features/media'

const mediaSearchSchema = mediaAssetFiltersSchema.partial()

export const Route = createFileRoute('/admin/media/')({
  validateSearch: (search) => mediaSearchSchema.parse(search),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/admin/workspaces/content/media',
      search,
    })
  },
  component: () => null,
})
