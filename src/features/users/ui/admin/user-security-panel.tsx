import { MonitorSmartphone, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/empties/empty-state'
import { toSecurityEventLabel } from '@/features/users/model/event-labels'

type SecurityEvent = {
  id: string
  type: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
}

type SessionItem = {
  id: string
  userAgent: string | null
  ipAddress: string | null
  expiresAt: Date
  createdAt: Date
}

export function UserSecurityPanel({
  sessions,
  events,
}: {
  sessions: Array<SessionItem>
  events: Array<SecurityEvent>
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card text-card-foreground shadow-sm ring-0">
        <CardHeader>
          <CardTitle className="text-foreground">Active Sessions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {sessions.length === 0 ? (
            <EmptyState
              icon={MonitorSmartphone}
              title="No active sessions"
              description="Sessions appear after user authentication."
              className="border-border bg-card text-foreground"
            />
          ) : (
            sessions.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-border bg-card p-4 text-sm"
              >
                <p className="font-semibold text-foreground">
                  {entry.userAgent || 'Unknown agent'}
                </p>

                <p className="text-muted-foreground">
                  IP: {entry.ipAddress || 'Unknown'}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Expires: {new Date(entry.expiresAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card text-card-foreground shadow-sm ring-0">
        <CardHeader>
          <CardTitle className="text-foreground">Security Events</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {events.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No security events"
              description="Security events will appear once account actions are captured."
              className="border-border bg-card text-foreground"
            />
          ) : (
            events.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-border bg-card p-4 text-sm"
              >
                <Badge className="border-border bg-muted text-foreground">
                  {toSecurityEventLabel(entry.type)}
                </Badge>

                <p className="text-muted-foreground">
                  IP: {entry.ipAddress || 'Unknown'}
                </p>

                <p className="text-muted-foreground">
                  Agent: {entry.userAgent || 'Unknown'}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
