import { createFileRoute, redirect } from '@tanstack/react-router'
import { userAdminFiltersSchema } from '@/features/users/model/filters'

const usersSearchSchema = userAdminFiltersSchema.partial()

export const Route = createFileRoute('/admin/users/')({
  validateSearch: (search) => usersSearchSchema.parse(search),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/admin/workspaces/operations/users',
      search,
    })
  },
  component: () => null,
})
