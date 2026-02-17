import { Monitor, ShieldCheck, ShieldOff } from 'lucide-react'
import type { UserAdminSessionItem } from '@/features/users/model/types'
import { EmptyState } from '@/components/empties/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserStatusBadge } from '@/features/users/ui/admin/user-status-badge'

interface UserSessionsTabProps {
  sessions: Array<UserAdminSessionItem>
  onOpenUser: (userId: string) => void
}

export function UserSessionsTab({
  sessions,
  onOpenUser,
}: UserSessionsTabProps) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={Monitor}
        title="No active sessions found"
        description="User sessions will appear here when accounts authenticate."
        className="border-border bg-card text-foreground"
      />
    )
  }

  return (
    <div className="grid gap-3">
      {sessions.map((entry) => (
        <article
          key={entry.id}
          className="rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">
                {entry.userName}
              </p>
              <p className="text-xs text-muted-foreground">
                {entry.userEmail}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border border-border bg-secondary text-muted-foreground">
                {entry.userRole === 'admin' ? (
                  <ShieldCheck className="size-3.5" />
                ) : (
                  <ShieldOff className="size-3.5" />
                )}
                {entry.userRole}
              </Badge>
              <UserStatusBadge status={entry.userStatus} />
            </div>
          </div>

          <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
            <p className="flex items-center gap-1.5">
              <Monitor className="size-3.5" />
              {entry.userAgent ?? 'Unknown device'}
            </p>
            <p>IP: {entry.ipAddress ?? 'Unknown'}</p>
            <p>Expires: {entry.expiresAt.toLocaleString()}</p>
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenUser(entry.userId)}
            >
              Inspect User
            </Button>
          </div>
        </article>
      ))}
    </div>
  )
}
