import { ShieldX } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

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
          disabled={revokingAll || revokingToken !== null}
        >
          <ShieldX className="size-4" />
          Revoke All Sessions
        </Button>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active sessions.</p>
      ) : (
        sessions.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-sm md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                {entry.userAgent || 'Unknown agent'}
              </p>
              <p className="text-muted-foreground">
                IP: {entry.ipAddress || 'Unknown'}
              </p>
              <p className="text-muted-foreground">
                Expires: {new Date(entry.expiresAt).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Started: {new Date(entry.createdAt).toLocaleString()}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-destructive/40 bg-background text-destructive hover:bg-destructive/10"
              disabled={revokingAll || revokingToken === entry.token}
              onClick={() => {
                setRevokingToken(entry.token)
                void onRevokeSession(entry.token).finally(() =>
                  setRevokingToken(null),
                )
              }}
            >
              {revokingToken === entry.token ? 'Revoking...' : 'Revoke Session'}
            </Button>
          </div>
        ))
      )}
    </div>
  )
}
