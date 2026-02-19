import { createFileRoute, redirect } from '@tanstack/react-router'
import { contactAdminFiltersSchema } from '@/features/contact/model/filters'

const contactsSearchSchema = contactAdminFiltersSchema.partial()

export const Route = createFileRoute('/admin/contacts/')({
  validateSearch: (search) => contactsSearchSchema.parse(search),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/admin/workspaces/operations/contacts',
      search,
    })
  },
  component: () => null,
})
