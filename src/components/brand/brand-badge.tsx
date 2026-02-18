import type { ComponentProps } from 'react'
import { useBrand } from '@/components/brand/use-brand'
import { Badge } from '@/components/ui/badge'

interface BrandBadgeProps extends ComponentProps<typeof Badge> {
  showServiceName?: boolean
}

export function BrandBadge({
  className,
  showServiceName = false,
  ...props
}: BrandBadgeProps) {
  const brand = useBrand()

  return (
    <Badge className={className} variant="secondary" {...props}>
      {showServiceName ? `${brand.siteName} · ${brand.serviceName}` : brand.siteName}
    </Badge>
  )
}
