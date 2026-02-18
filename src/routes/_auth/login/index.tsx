import { createFileRoute, redirect } from '@tanstack/react-router'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { resolvePostAuthRedirect } from '@/features/auth/model/post-auth'
import { authEntrySearchSchema } from '@/features/auth/schemas/auth'
import { getOptionalSessionFn } from '@/features/auth/server/session'
import { LoginForm } from '@/features/auth/ui/login-form'

export const redirectAuthenticatedLogin = async (redirectTo?: string) => {
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

export const Route = createFileRoute('/_auth/login/')({
  validateSearch: (search) => authEntrySearchSchema.parse(search),
  beforeLoad: ({ search }) => redirectAuthenticatedLogin(search.redirect),
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Login'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Access your account securely to manage your services and preferences.',
        ),
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { redirect: redirectPath } = Route.useSearch()

  return <LoginForm redirectTo={redirectPath} />
}
