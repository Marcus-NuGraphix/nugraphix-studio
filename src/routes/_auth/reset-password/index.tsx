import { createFileRoute } from '@tanstack/react-router'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { resetPasswordSearchSchema } from '@/features/auth/schemas/auth'
import { ResetPasswordForm } from '@/features/auth/ui/reset-password-form'

export const Route = createFileRoute('/_auth/reset-password/')({
  validateSearch: (search) => resetPasswordSearchSchema.parse(search),
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Reset Password'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Set a new password and restore secure account access.',
        ),
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useParams()
  const { callbackURL } = Route.useSearch()

  return <ResetPasswordForm token={token} redirectTo={callbackURL ?? '/'} />
}
