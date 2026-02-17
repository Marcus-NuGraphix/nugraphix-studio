import type { ReactNode } from 'react'
import { BrandLogo, BrandWordmark } from '@/components/brand'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const AUTH_INPUT_CLASSNAME =
  'border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30'

export const AUTH_INPUT_GROUP_CLASSNAME =
  'border-input bg-background has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30'

export const AUTH_INPUT_GROUP_TOGGLE_CLASSNAME =
  'text-muted-foreground hover:bg-muted hover:text-foreground'

interface AuthFormCardProps {
  title: string
  description: string
  panelBadge: string
  panelTitle: string
  panelDescription: string
  panelHighlights: Array<string>
  footer?: ReactNode
  children: ReactNode
  className?: string
}

export function AuthFormCard({
  title,
  description,
  panelBadge,
  panelTitle,
  panelDescription,
  panelHighlights,
  footer,
  children,
  className,
}: AuthFormCardProps) {
  return (
    <div className={cn('flex w-full flex-col gap-5', className)}>
      <Card className="overflow-hidden border-border bg-card p-0 shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <BrandLogo className="size-11 rounded-xl border border-border bg-background p-1.5 shadow-sm" />
              <BrandWordmark compact className="text-base text-foreground" />
            </div>

            <div className="mb-6 flex flex-col items-center gap-2 text-center md:items-start md:text-left">
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {children}
          </div>

          <aside className="relative hidden overflow-hidden md:block">
            {/* token-based gradient instead of brand-blue scale */}
            <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/90 to-primary/80" />
            {/* token-based “glow” using accent */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--accent)/0.28)_0%,transparent_55%)]" />

            {/* token-based grid overlay */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, hsl(var(--primary)/0.35) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)/0.35) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
            />

            <div className="relative flex h-full flex-col justify-between gap-8 p-8 text-primary-foreground">
              <div className="space-y-4">
                <BrandWordmark className="text-lg font-semibold text-primary-foreground" />

                <Badge className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground">
                  {panelBadge}
                </Badge>

                <h2 className="text-2xl font-semibold leading-tight text-primary-foreground">
                  {panelTitle}
                </h2>

                <p className="text-sm leading-7 text-primary-foreground/80">
                  {panelDescription}
                </p>
              </div>

              <ul className="space-y-2">
                {panelHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-primary-foreground/85"
                  >
                    <span className="mt-1.5 inline-block size-2 shrink-0 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </CardContent>
      </Card>

      {footer ? (
        <p className="px-3 text-center text-xs text-muted-foreground">
          {footer}
        </p>
      ) : null}
    </div>
  )
}
