import { createFileRoute } from '@tanstack/react-router'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { authEntrySearchSchema } from '@/features/auth/schemas/auth'
import { redirectAuthenticatedAuthEntry } from '@/features/auth/server/entry-redirect'
import { SignupForm } from '@/features/auth/ui/signup-form'

export const Route = createFileRoute('/_auth/signup/')({
  validateSearch: (search) => authEntrySearchSchema.parse(search),
  beforeLoad: ({ search }) => redirectAuthenticatedAuthEntry(search.redirect),
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
