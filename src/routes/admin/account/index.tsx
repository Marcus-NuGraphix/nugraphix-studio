import { createFileRoute, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  changeMyPasswordFn,
  getMyAccountFn,
  revokeAllMySessionsFn,
  revokeMySessionFn,
  updateMyProfileFn,
} from '@/features/users/server/users'
import { AccountOverview } from '@/features/users/ui/account/account-overview'

export const Route = createFileRoute('/admin/account/')({
  loader: async () => getMyAccountFn(),
  component: AdminAccountPage,
})

function AdminAccountPage() {
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
      isAdminView
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
