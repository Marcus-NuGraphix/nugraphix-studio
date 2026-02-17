import { useBrand } from '@/components/brand/use-brand'
import { Badge } from '@/components/ui/badge'

export function BrandBadge({
  className,
  ...props
}: React.ComponentProps<typeof Badge>) {
  const brand = useBrand()

  return (
    <Badge className={className} variant="secondary" {...props}>
      {brand.siteName}
    </Badge>
  )
}
