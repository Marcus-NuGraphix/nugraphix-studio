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
      <p className="text-sm text-muted-foreground">
        No security events recorded.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((entry) => (
        <div
          key={entry.id}
          className="rounded-xl border border-border bg-card p-4 text-sm"
        >
          <p className="font-semibold text-foreground">{entry.type}</p>

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
      ))}
    </div>
  )
}
