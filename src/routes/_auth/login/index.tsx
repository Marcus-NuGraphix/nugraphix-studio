import { createFileRoute } from '@tanstack/react-router'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { authEntrySearchSchema } from '@/features/auth/schemas/auth'
import { redirectAuthenticatedAuthEntry } from '@/features/auth/server/entry-redirect'
import { LoginForm } from '@/features/auth/ui/login-form'

export const Route = createFileRoute('/_auth/login/')({
  validateSearch: (search) => authEntrySearchSchema.parse(search),
  beforeLoad: ({ search }) => redirectAuthenticatedAuthEntry(search.redirect),
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
