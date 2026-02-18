import { createFileRoute, redirect } from '@tanstack/react-router'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { resolvePostAuthRedirect } from '@/features/auth/model/post-auth'
import { authEntrySearchSchema } from '@/features/auth/schemas/auth'
import { getOptionalSessionFn } from '@/features/auth/server/session'
import { SignupForm } from '@/features/auth/ui/signup-form'

export const redirectAuthenticatedSignup = async (redirectTo?: string) => {
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

export const Route = createFileRoute('/_auth/signup/')({
  validateSearch: (search) => authEntrySearchSchema.parse(search),
  beforeLoad: ({ search }) => redirectAuthenticatedSignup(search.redirect),
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Sign Up'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Create your account to manage your details, preferences, and service-related updates securely.',
        ),
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { redirect: redirectPath } = Route.useSearch()

  return <SignupForm redirectTo={redirectPath} />
}
