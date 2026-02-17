import { Clock3 } from 'lucide-react'
import type { UserAuditItem } from '@/features/users/model/types'
import { EmptyState } from '@/components/empties/empty-state'
import { Button } from '@/components/ui/button'

interface UserAuditTabProps {
  items: Array<UserAuditItem>
  onOpenUser: (userId: string) => void
}

const actionLabels: Record<string, string> = {
  'user-created': 'User Created',
  'profile-updated': 'Profile Updated',
  'password-changed': 'Password Changed',
  'role-updated': 'Role Updated',
  'status-suspended': 'Account Suspended',
  'status-reactivated': 'Account Reactivated',
  'sessions-revoked': 'Sessions Revoked',
  'session-revoked': 'Session Revoked',
  'account-deleted': 'Account Deleted',
}

const toActionLabel = (value: string) => actionLabels[value] ?? value

export function UserAuditTab({ items, onOpenUser }: UserAuditTabProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Clock3}
        title="No audit events found"
        description="Security audit events will appear here as admin actions occur."
        className="border-border bg-card text-foreground"
      />
    )
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const targetUserId = item.targetUserId

        return (
          <article
            key={item.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {toActionLabel(item.action)}
                </p>

                <p className="text-xs text-muted-foreground">
                  Actor: {item.actorEmail ?? 'System'}
                </p>

                <p className="text-xs text-muted-foreground">
                  Target: {item.targetEmail}
                </p>

                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock3 className="size-3.5" />
                  {item.createdAt.toLocaleString()}
                </p>
              </div>

              {targetUserId ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-background text-foreground hover:bg-muted"
                  onClick={() => onOpenUser(targetUserId)}
                >
                  Inspect Target
                </Button>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}
