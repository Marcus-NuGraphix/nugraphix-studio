import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { getSessionFn } from '@/features/auth/server/session'
import {
  changeMyPasswordFn,
  getMyAccountFn,
  revokeAllMySessionsFn,
  revokeMySessionFn,
  updateMyProfileFn,
} from '@/features/users/server/users'
import { AccountOverview } from '@/features/users/ui/account/account-overview'

export const Route = createFileRoute('/_auth/account/')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (session.user.role === 'admin') {
      throw redirect({ to: '/admin/account' })
    }
  },
  loader: async () => getMyAccountFn(),
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Account'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Manage your account profile, password, and session security settings.',
        ),
      },
    ],
  }),
  component: AccountRouteComponent,
})

function AccountRouteComponent() {
  const router = useRouter()
  const account = Route.useLoaderData()

  const runAction = async (task: () => Promise<void>, successMessage: string) => {
    try {
      await task()
      toast.success(successMessage)
      await router.invalidate({ sync: true })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to complete this action right now.',
      )
      throw error
    }
  }

  return (
    <AccountOverview
      profile={account.profile}
      sessions={account.sessions}
      securityEvents={account.securityEvents}
      onUpdateProfile={(value) =>
        runAction(
          async () => {
            await updateMyProfileFn({ data: value })
          },
          'Profile updated successfully.',
        )
      }
      onChangePassword={(value) =>
        runAction(
          async () => {
            await changeMyPasswordFn({ data: value })
          },
          'Password updated successfully.',
        )
      }
      onRevokeSession={(token) =>
        runAction(
          async () => {
            await revokeMySessionFn({ data: { token } })
          },
          'Session revoked.',
        )
      }
      onRevokeAllSessions={() =>
        runAction(
          async () => {
            await revokeAllMySessionsFn({ data: { revoke: true } })
          },
          'All sessions revoked.',
        )
      }
    />
  )
}
