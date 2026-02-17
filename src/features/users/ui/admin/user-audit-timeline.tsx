import { Clock3 } from 'lucide-react'
import { EmptyState } from '@/components/empties/empty-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type AuditItem = {
  id: string
  action: string
  actorEmail: string | null
  targetEmail: string
  createdAt: Date
}

export function UserAuditTimeline({ items }: { items: Array<AuditItem> }) {
  return (
    <Card className="border-border bg-card text-card-foreground shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="text-foreground">Audit Timeline</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <EmptyState
            icon={Clock3}
            title="No audit events yet"
            description="User account activity will appear here once events are recorded."
            className="border-border bg-card text-foreground"
          />
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="grid gap-2 rounded-xl border border-border bg-card p-4 text-sm md:grid-cols-[auto_1fr]"
            >
              <div className="mt-1 hidden size-2 rounded-full bg-primary md:block" />

              <div className="space-y-1.5">
                <p className="font-semibold text-foreground">{item.action}</p>

                <p className="text-muted-foreground">
                  Actor: {item.actorEmail ?? 'system'}
                </p>

                <p className="text-muted-foreground">
                  Target: {item.targetEmail}
                </p>

                <p className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
