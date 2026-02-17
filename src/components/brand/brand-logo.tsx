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
      className={cn('lg:size-12 size-8 rounded-md object-contain', className)}
      {...props}
    />
  )
}
