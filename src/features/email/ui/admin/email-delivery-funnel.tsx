import { cn } from '@/lib/utils'

interface EmailDeliveryFunnelProps {
  overview: {
    total: number
    queued: number
    sent: number
    delivered: number
    opened: number
    clicked: number
    failed: number
    bounced: number
  }
  activeStatus?: string
  onStageSelect: (status?: string) => void
}

const stages = [
  { status: 'queued', label: 'Queued', valueKey: 'queued' },
  { status: 'sent', label: 'Sent', valueKey: 'sent' },
  { status: 'delivered', label: 'Delivered', valueKey: 'delivered' },
  { status: 'opened', label: 'Opened', valueKey: 'opened' },
  { status: 'clicked', label: 'Clicked', valueKey: 'clicked' },
] as const

export function EmailDeliveryFunnel({
  overview,
  activeStatus,
  onStageSelect,
}: EmailDeliveryFunnelProps) {
  return (
    <section className="space-y-3 rounded-xl border border-border bg-muted/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Delivery Funnel
          </p>
          <p className="text-sm text-muted-foreground">
            Message progression from queue to recipient engagement.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onStageSelect(undefined)}
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          Clear status filter
        </button>
      </div>

      <div className="grid gap-2 xl:grid-cols-5">
        {stages.map((stage) => {
          const value = overview[stage.valueKey]
          const isActive = activeStatus === stage.status
          const width =
            overview.total > 0
              ? Math.max(10, Math.round((value / overview.total) * 100))
              : 10

          return (
            <button
              key={stage.status}
              type="button"
              onClick={() => onStageSelect(stage.status)}
              className={cn(
                'rounded-lg border bg-card px-3 py-2 text-left transition-colors',
                isActive
                  ? 'border-ring shadow-sm'
                  : 'border-border hover:border-input',
              )}
              aria-pressed={isActive}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {stage.label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {value}
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${width}%` }}
                />
              </div>
            </button>
          )
        })}
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-destructive">
            Failed
          </p>
          <p className="text-lg font-semibold text-destructive">
            {overview.failed}
          </p>
        </div>
        <div className="rounded-lg border border-ring/30 bg-muted px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Bounced
          </p>
          <p className="text-lg font-semibold text-foreground">
            {overview.bounced}
          </p>
        </div>
      </div>
    </section>
  )
}
