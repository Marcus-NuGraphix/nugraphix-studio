import { Activity, Clock3, Globe } from 'lucide-react'
import { EmptyState } from '@/components/empties/empty-state'
import { Badge } from '@/components/ui/badge'
import { toSecurityEventLabel } from '@/features/users/model/event-labels'

type SecurityEventItem = {
  id: string
  type: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
}

export function SecurityEventsList({
  events,
}: {
  events: Array<SecurityEventItem>
}) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No security events recorded"
        description="Security-related events appear here as they are detected or triggered."
        className="border-border bg-card text-foreground"
      />
    )
  }

  return (
    <div className="space-y-3">
      {events.map((entry) => (
        <article
          key={entry.id}
          className="space-y-2 rounded-xl border border-border bg-card p-4 text-sm"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-border bg-muted text-foreground">
              {toSecurityEventLabel(entry.type)}
            </Badge>
            <p className="text-xs text-muted-foreground">
              <Clock3 className="mr-1 inline size-3.5" />
              {new Date(entry.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
            <p className="flex items-center gap-1.5">
              <Globe className="size-3.5" />
              IP: {entry.ipAddress || 'Unknown'}
            </p>
            <p className="line-clamp-2">Agent: {entry.userAgent || 'Unknown'}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
