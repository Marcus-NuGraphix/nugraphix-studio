import { createFileRoute, redirect } from '@tanstack/react-router'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { resolvePostAuthRedirect } from '@/features/auth/model/post-auth'
import { authEntrySearchSchema } from '@/features/auth/schemas/auth'
import { getOptionalSessionFn } from '@/features/auth/server/session'
import { ForgotPasswordForm } from '@/features/auth/ui/forgot-password-form'

export const redirectAuthenticatedForgotPassword = async (redirectTo?: string) => {
  const session = await getOptionalSessionFn()
  if (session) {
    throw redirect({
      to: resolvePostAuthRedirect({
        requestedRedirect: redirectTo,
        role: session.user.role,
      }),
    })
  }
}

export const Route = createFileRoute('/_auth/forgot-password/')({
  validateSearch: (search) => authEntrySearchSchema.parse(search),
  beforeLoad: ({ search }) =>
    redirectAuthenticatedForgotPassword(search.redirect),
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
