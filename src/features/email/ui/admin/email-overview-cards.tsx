import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface EmailOverviewCardsProps {
  overview: {
    total: number
    sent: number
    delivered: number
    opened: number
    clicked: number
    failed: number
    bounced: number
    queued: number
  }
}

export function EmailOverviewCards({ overview }: EmailOverviewCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <StatCard label="Total" value={overview.total} />
      <StatCard label="Queued" value={overview.queued} />
      <StatCard label="Sent" value={overview.sent} />
      <StatCard label="Delivered" value={overview.delivered} />
      <StatCard label="Opened" value={overview.opened} />
      <StatCard label="Clicked" value={overview.clicked} />
      <StatCard label="Failed" value={overview.failed} />
      <StatCard label="Bounced" value={overview.bounced} />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  const isError = label === 'Failed' || label === 'Bounced'

  return (
    <Card className="border-border bg-card text-card-foreground ring-0">
      <CardHeader className="pb-2">
        <CardTitle
          className={
            isError
              ? 'text-sm font-medium text-destructive'
              : 'text-sm font-medium text-muted-foreground'
          }
        >
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={
            isError
              ? 'text-3xl font-semibold tracking-tight text-destructive'
              : 'text-3xl font-semibold tracking-tight text-foreground'
          }
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
