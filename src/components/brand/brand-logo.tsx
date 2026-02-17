import { useBrand } from '@/components/brand/use-brand'
import { cn } from '@/lib/utils'

export function BrandLogo({
  className,
  ...props
}: Omit<React.ComponentProps<'img'>, 'src' | 'alt'>) {
  const brand = useBrand()

  return (
    <img
      src={brand.assets.logoPath}
      alt={`${brand.companyName} logo`}
      className={cn('size-36 rounded-md object-contain', className)}
      {...props}
    />
  )
}
