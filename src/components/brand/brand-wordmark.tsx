import { useBrand } from '@/components/brand/use-brand'
import { cn } from '@/lib/utils'

export function BrandWordmark({
  className,
  compact = false,
  ...props
}: React.ComponentProps<'span'> & { compact?: boolean }) {
  const brand = useBrand()
  const label = compact ? brand.companyName : brand.siteName

  return (
    <span
      className={cn('text-2xl lg:text-3xl font-bold leading-tight', className)}
      {...props}
    >
      {label}
    </span>
  )
}
