import type { ElementType, ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MarketingContainerProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'main'
  compact?: boolean
}

export function MarketingContainer({
  children,
  className,
  as = 'div',
  compact = false,
}: MarketingContainerProps) {
  const Comp = as as ElementType

  return (
    <Comp
      className={cn(
        'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
        compact ? 'space-y-8 py-8 sm:py-10' : 'space-y-12 py-10 sm:py-14',
        className,
      )}
    >
      {children}
    </Comp>
  )
}

interface MarketingHeroProps {
  badge?: string
  title: string
  description: string
  eyebrow?: string
  actions?: ReactNode
  supportingPanel?: ReactNode
  className?: string
}

export function MarketingHero({
  badge,
  title,
  description,
  eyebrow,
  actions,
  supportingPanel,
  className,
}: MarketingHeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10 lg:p-12',
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-24 right-[-3rem] size-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-[-5rem] size-64 rounded-full bg-secondary/40 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-end">
        <div className="max-w-3xl space-y-4">
          {(badge || eyebrow) && (
            <div className="flex flex-wrap items-center gap-2">
              {badge ? (
                <Badge variant="secondary" className="rounded-full">
                  {badge}
                </Badge>
              ) : null}
              {eyebrow ? (
                <span className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
                  {eyebrow}
                </span>
              ) : null}
            </div>
          )}

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
          {actions ? (
            <div className="flex flex-wrap items-center gap-3 pt-2">{actions}</div>
          ) : null}
        </div>

        {supportingPanel ? (
          <aside className="rounded-2xl border border-border bg-background/80 p-4">
            {supportingPanel}
          </aside>
        ) : null}
      </div>
    </section>
  )
}

interface MarketingSectionProps {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
}

export function MarketingSection({
  title,
  description,
  children,
  actions,
  className,
}: MarketingSectionProps) {
  return (
    <section className={cn('space-y-5', className)}>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="text-pretty text-base leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </header>
      {children}
    </section>
  )
}

interface MarketingCardProps {
  title: string
  description: string
  meta?: string
  icon?: ReactNode
  actions?: ReactNode
  className?: string
}

export function MarketingCard({
  title,
  description,
  meta,
  icon,
  actions,
  className,
}: MarketingCardProps) {
  return (
    <Card
      className={cn(
        'group border-border bg-card shadow-none transition-colors hover:border-primary/30',
        className,
      )}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {meta ? (
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {meta}
            </p>
          ) : (
            <span />
          )}
          {icon ? (
            <span className="text-muted-foreground group-hover:text-primary transition-colors">
              {icon}
            </span>
          ) : null}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-7 text-muted-foreground">
          {description}
        </CardDescription>
        {actions ? <div className="mt-4">{actions}</div> : null}
      </CardContent>
    </Card>
  )
}

interface MarketingCtaProps {
  title: string
  description: string
  actions?: ReactNode
  tone?: 'default' | 'accent'
  className?: string
}

export function MarketingCta({
  title,
  description,
  actions,
  tone = 'default',
  className,
}: MarketingCtaProps) {
  return (
    <section
      className={cn(
        'rounded-3xl border p-8 sm:p-10',
        tone === 'default' && 'border-border bg-secondary',
        tone === 'accent' && 'border-primary/20 bg-primary/10',
        className,
      )}
    >
      <div className="max-w-3xl space-y-3">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-pretty text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </div>
      {actions ? <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div> : null}
    </section>
  )
}
