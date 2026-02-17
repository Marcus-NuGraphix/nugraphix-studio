import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MarketingContainerProps {
  children: ReactNode
  className?: string
}

export function MarketingContainer({
  children,
  className,
}: MarketingContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-7xl space-y-12 px-4 py-10 sm:px-6 sm:py-14 lg:px-8',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface MarketingHeroProps {
  badge?: string
  title: string
  description: string
  actions?: ReactNode
}

export function MarketingHero({
  badge,
  title,
  description,
  actions,
}: MarketingHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
      <div className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-16 size-56 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative max-w-3xl space-y-4">
        {badge ? (
          <Badge variant="secondary" className="rounded-full">
            {badge}
          </Badge>
        ) : null}
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
        {actions ? <div className="flex flex-wrap items-center gap-3 pt-2">{actions}</div> : null}
      </div>
    </section>
  )
}

interface MarketingSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function MarketingSection({
  title,
  description,
  children,
}: MarketingSectionProps) {
  return (
    <section className="space-y-5">
      <header className="max-w-3xl space-y-2">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="text-pretty text-base leading-7 text-muted-foreground">
            {description}
          </p>
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
  className?: string
}

export function MarketingCard({
  title,
  description,
  meta,
  className,
}: MarketingCardProps) {
  return (
    <Card className={cn('border-border bg-card shadow-none', className)}>
      <CardHeader className="space-y-2">
        {meta ? (
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {meta}
          </p>
        ) : null}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-7 text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

interface MarketingCtaProps {
  title: string
  description: string
  actions?: ReactNode
}

export function MarketingCta({ title, description, actions }: MarketingCtaProps) {
  return (
    <section className="rounded-3xl border border-border bg-secondary p-8 sm:p-10">
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
