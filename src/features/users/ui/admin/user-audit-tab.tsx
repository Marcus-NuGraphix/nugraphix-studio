import { Clock3, ShieldCheck } from 'lucide-react'
import type { UserAuditItem } from '@/features/users/model/types'
import { EmptyState } from '@/components/empties/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toAuditActionLabel } from '@/features/users/model/event-labels'

interface UserAuditTabProps {
  items: Array<UserAuditItem>
  onOpenUser: (userId: string) => void
}

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
                <Badge className="border-border bg-muted text-foreground">
                  <ShieldCheck className="size-3.5" />
                  {toAuditActionLabel(item.action)}
                </Badge>

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
