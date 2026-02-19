import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { useBrand } from '@/components/brand/use-brand'
import { cn } from '@/lib/utils'

type BrandWordmarkElement = 'span' | 'p' | 'h1' | 'h2'

interface BrandWordmarkProps extends ComponentPropsWithoutRef<'span'> {
  as?: BrandWordmarkElement
  compact?: boolean
  includeTagline?: boolean
}

export function BrandWordmark({
  as,
  className,
  compact = false,
  includeTagline = false,
  ...props
}: BrandWordmarkProps) {
  const brand = useBrand()
  const label = compact ? brand.companyName : brand.siteName
  const Comp = (as ?? 'span') as ElementType

  return (
    <span className={cn('inline-flex flex-col gap-0.5', className)} {...props}>
      <Comp className="leading-tight font-semibold tracking-tight">{label}</Comp>
      {includeTagline ? (
        <span className="text-muted-foreground text-xs">{brand.tagline}</span>
      ) : null}
    </span>
  )
}
