import { createFileRoute, redirect } from '@tanstack/react-router'
import { blogAdminPostFiltersSchema } from '@/features/blog/model/filters'

const postsSearchSchema = blogAdminPostFiltersSchema.partial()

export const Route = createFileRoute('/admin/content/posts/')({
  validateSearch: (search) => postsSearchSchema.parse(search),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/admin/workspaces/content/posts',
      search,
    })
  },
  component: () => null,
})
