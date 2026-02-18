import {
  Clock3,
  Globe,
  MonitorSmartphone,
  ShieldX,
  Smartphone,
} from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/components/empties/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SessionItem = {
  id: string
  token: string
  userAgent?: string | null
  ipAddress?: string | null
  expiresAt: Date
  createdAt: Date
}

export function SessionList({
  sessions,
  onRevokeSession,
  onRevokeAll,
}: {
  sessions: Array<SessionItem>
  onRevokeSession: (token: string) => Promise<void>
  onRevokeAll: () => Promise<void>
}) {
  const [revokingToken, setRevokingToken] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Manage active sessions for your account.
        </p>

        <Button
          variant="outline"
          className="bg-background text-foreground hover:bg-muted"
          onClick={() => {
            setRevokingAll(true)
            void onRevokeAll().finally(() => setRevokingAll(false))
          }}
          disabled={revokingAll || revokingToken !== null || sessions.length === 0}
        >
          <ShieldX className="size-4" />
          Revoke All Sessions
        </Button>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={MonitorSmartphone}
          title="No active sessions"
          description="When you sign in from devices or browsers, session records appear here."
          className="border-border bg-card text-foreground"
        />
      ) : (
        sessions.map((entry, index) => {
          const isCurrentSession = index === 0
          const isRevokingThis = revokingToken === entry.token

          return (
            <article
              key={entry.id}
              className={cn(
                'flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-sm md:flex-row md:items-center md:justify-between',
                isCurrentSession && 'border-primary/35 bg-primary/5',
              )}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground">
                    {entry.userAgent || 'Unknown device'}
                  </p>
                  {isCurrentSession ? (
                    <Badge className="border-primary/30 bg-primary/10 text-primary">
                      Current Session
                    </Badge>
                  ) : null}
                </div>
                <div className="grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-3">
                  <p className="flex items-center gap-1.5">
                    <Globe className="size-3.5" />
                    IP: {entry.ipAddress || 'Unknown'}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock3 className="size-3.5" />
                    Started: {new Date(entry.createdAt).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Smartphone className="size-3.5" />
                    Expires: {new Date(entry.expiresAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="border-destructive/40 bg-background text-destructive hover:bg-destructive/10"
                disabled={revokingAll || isRevokingThis}
                onClick={() => {
                  setRevokingToken(entry.token)
                  void onRevokeSession(entry.token).finally(() =>
                    setRevokingToken(null),
                  )
                }}
              >
                {isRevokingThis ? 'Revoking...' : 'Revoke Session'}
              </Button>
            </article>
          )
        })
      )}
    </div>
  )
}
