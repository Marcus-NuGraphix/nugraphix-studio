import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { getSessionFn } from '@/features/auth/server/session'
import {
  getMyEmailPreferencesFn,
  updateMyEmailPreferencesFn,
} from '@/features/email/server/email'
import { EmailPreferencesForm } from '@/features/email'

export const Route = createFileRoute('/_auth/account/notifications')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (session.user.role === 'admin') {
      throw redirect({ to: '/admin/email' })
    }
  },
  loader: async () => getMyEmailPreferencesFn(),
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Email Notifications'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Manage editorial and security notification preferences for your Nu Graphix account.',
        ),
      },
    ],
  }),
  component: AccountNotificationsPage,
})

function AccountNotificationsPage() {
  const router = useRouter()
  const preferences = Route.useLoaderData()

  return (
    <section className="w-full space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Notification Preferences"
        description="Control the email topics you receive while preserving required account and security communications."
        actions={
          <Button variant="outline" asChild>
            <Link to="/account">Back to Account</Link>
          </Button>
        }
      />

      <EmailPreferencesForm
        initialValues={{
          transactionalEnabled: preferences.transactionalEnabled,
          editorialEnabled: preferences.editorialEnabled,
          blogUpdatesEnabled: preferences.blogUpdatesEnabled,
          pressUpdatesEnabled: preferences.pressUpdatesEnabled,
          productUpdatesEnabled: preferences.productUpdatesEnabled,
          securityAlertsEnabled: preferences.securityAlertsEnabled,
        }}
        onSubmit={async (values) => {
          try {
            await updateMyEmailPreferencesFn({ data: values })
            toast.success('Email preferences updated.')
            await router.invalidate({ sync: true })
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : 'Unable to save preferences right now.',
            )
            throw error
          }
        }}
      />
    </section>
  )
}
