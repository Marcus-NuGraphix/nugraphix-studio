import { createFileRoute } from '@tanstack/react-router'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { authEntrySearchSchema } from '@/features/auth/schemas/auth'
import { redirectAuthenticatedAuthEntry } from '@/features/auth/server/entry-redirect'
import { ForgotPasswordForm } from '@/features/auth/ui/forgot-password-form'

export const Route = createFileRoute('/_auth/forgot-password/')({
  validateSearch: (search) => authEntrySearchSchema.parse(search),
  beforeLoad: ({ search }) => redirectAuthenticatedAuthEntry(search.redirect),
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Forgot Password'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Request a secure password reset link for your account.',
        ),
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { redirect: redirectPath } = Route.useSearch()

  return <ForgotPasswordForm redirectTo={redirectPath ?? '/'} />
}
