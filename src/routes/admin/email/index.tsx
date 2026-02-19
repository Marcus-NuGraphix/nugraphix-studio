import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { emailAdminFiltersSchema } from '@/features/email/schemas/admin'

const adminEmailSearchSchema = emailAdminFiltersSchema.partial().extend({
  messageId: z.string().trim().min(1).optional(),
})

export const Route = createFileRoute('/admin/email/')({
  validateSearch: (search) => adminEmailSearchSchema.parse(search),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/admin/workspaces/operations/email',
      search,
    })
  },
  component: () => null,
})
