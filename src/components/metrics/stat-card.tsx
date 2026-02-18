import { TrendingDown, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatTone = 'neutral' | 'info' | 'success' | 'warning' | 'destructive'
type TrendDirection = 'up' | 'down'

interface StatCardProps {
  label: string
  value: string | number
  description?: string
  tone?: StatTone
  icon?: LucideIcon
  trend?: {
    label: string
    direction: TrendDirection
  }
  className?: string
}

const toneStyles: Record<StatTone, string> = {
  neutral: 'border-border bg-card text-foreground',
  info: 'border-border bg-secondary/50 text-foreground',
  success: 'border-accent/30 bg-accent/10 text-foreground',
  warning: 'border-ring/30 bg-muted text-foreground',
  destructive: 'border-destructive/30 bg-destructive/10 text-foreground',
}

export function StatCard({
  label,
  value,
  description,
  tone = 'neutral',
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  const trendIsUp = trend?.direction === 'up'

  return (
    <Card className={cn('shadow-none', toneStyles[tone], className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardDescription>{label}</CardDescription>
          <CardTitle className="text-2xl font-semibold">{value}</CardTitle>
        </div>
        {Icon ? (
          <div className="bg-muted flex size-8 items-center justify-center rounded-md">
            <Icon className="size-4 text-muted-foreground" />
          </div>
        ) : null}
      </CardHeader>
      {(description || trend) && (
        <CardContent className="flex flex-col gap-2">
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
          {trend ? (
            <p
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium',
                trendIsUp ? 'text-accent' : 'text-destructive',
              )}
            >
              {trendIsUp ? (
                <TrendingUp className="size-3.5" />
              ) : (
                <TrendingDown className="size-3.5" />
              )}
              {trend.label}
            </p>
          ) : null}
        </CardContent>
      )}
    </Card>
  )
}
