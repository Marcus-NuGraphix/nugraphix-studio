import { Link, createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { ArrowLeft, MailCheck, ShieldCheck, User2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getAdminSessionFn } from '@/features/auth/server/session'
import {
  deleteUserFn,
  getUserDetailFn,
  reactivateUserFn,
  revokeUserSessionsFn,
  setUserRoleFn,
  suspendUserFn,
} from '@/features/users/server/users'
import { UserAuditTimeline } from '@/features/users/ui/admin/user-audit-timeline'
import { UserDangerZone } from '@/features/users/ui/admin/user-danger-zone'
import { UserSecurityPanel } from '@/features/users/ui/admin/user-security-panel'
import { UserStatusBadge } from '@/features/users/ui/admin/user-status-badge'
import { UserSuspendDialog } from '@/features/users/ui/admin/user-suspend-dialog'

export const Route = createFileRoute('/admin/users/$userId')({
  loader: async ({ params }) => {
    const [adminSession, detail] = await Promise.all([
      getAdminSessionFn(),
      getUserDetailFn({ data: { id: params.userId } }),
    ])

    return {
      detail,
      currentUserId: adminSession.user.id,
    }
  },
  component: UserDetailPage,
})

function UserDetailPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const { detail, currentUserId } = Route.useLoaderData()
  const [suspendOpen, setSuspendOpen] = useState(false)

  const user = detail.user
  const isSelf = user.id === currentUserId

  const runMutation = async (task: () => Promise<void>, successMessage: string) => {
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
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="User Detail"
        title={user.name}
        description="Review account role, status, session footprint, and audit timeline from a single control surface."
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/users">
              <ArrowLeft className="size-4" />
              Back to Users
            </Link>
          </Button>
        }
      />

      <Card className="border-border bg-card shadow-none">
        <CardContent className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              Joined {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <UserStatusBadge status={user.status} />
            <Badge className="border-border bg-muted text-foreground">
              {user.role === 'admin' ? (
                <ShieldCheck className="size-3.5" />
              ) : (
                <User2 className="size-3.5" />
              )}
              {user.role}
            </Badge>
            <Badge
              className={
                user.emailVerified
                  ? 'border-accent/30 bg-accent/10 text-foreground'
                  : 'border-destructive/30 bg-destructive/10 text-destructive'
              }
            >
              {user.emailVerified ? (
                <>
                  <MailCheck className="size-3.5" />
                  Verified
                </>
              ) : (
                'Unverified'
              )}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Button
          variant="outline"
          disabled={isSelf}
          onClick={() =>
            void runMutation(
              async () => {
                await setUserRoleFn({
                  data: { id: user.id, role: user.role === 'admin' ? 'user' : 'admin' },
                })
              },
              `Role updated to ${user.role === 'admin' ? 'user' : 'admin'}.`,
            )
          }
        >
          Set role to {user.role === 'admin' ? 'user' : 'admin'}
        </Button>

        {user.status === 'suspended' ? (
          <Button
            variant="outline"
            onClick={() =>
              void runMutation(
                async () => {
                  await reactivateUserFn({ data: { id: user.id } })
                },
                'User account reactivated.',
              )
            }
          >
            Reactivate User
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled={isSelf}
            onClick={() => setSuspendOpen(true)}
          >
            Suspend User
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() =>
            void runMutation(
              async () => {
                await revokeUserSessionsFn({ data: { id: user.id } })
              },
              'User sessions revoked.',
            )
          }
        >
          Revoke Sessions
        </Button>

        <Button variant="outline" asChild>
          <Link to="/admin/users">Return to Directory</Link>
        </Button>
      </div>

      <UserSecurityPanel sessions={detail.sessions} events={detail.securityEvents} />

      <UserAuditTimeline items={detail.auditEvents} />

      <UserDangerZone
        onRevokeSessions={() =>
          void runMutation(
            async () => {
              await revokeUserSessionsFn({ data: { id: user.id } })
            },
            'User sessions revoked.',
          )
        }
        onDelete={() => {
          if (
            !window.confirm(
              'Delete this account permanently? This action cannot be undone.',
            )
          ) {
            return
          }

          void runMutation(
            async () => {
              await deleteUserFn({ data: { id: user.id } })
              await navigate({ to: '/admin/users' })
            },
            'User account deleted.',
          )
        }}
        disableDelete={isSelf}
      />

      <UserSuspendDialog
        open={suspendOpen}
        userName={user.name}
        onOpenChange={setSuspendOpen}
        onSubmit={async (reason) => {
          await runMutation(
            async () => {
              await suspendUserFn({ data: { id: user.id, reason } })
              setSuspendOpen(false)
            },
            'User account suspended.',
          )
        }}
      />
    </section>
  )
}
