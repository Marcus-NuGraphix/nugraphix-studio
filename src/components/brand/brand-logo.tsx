import type { ComponentPropsWithoutRef } from 'react'
import { useBrand } from '@/components/brand/use-brand'
import { cn } from '@/lib/utils'

const logoSizeStyles = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
} as const

export type BrandLogoSize = keyof typeof logoSizeStyles

interface BrandLogoProps
  extends Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> {
  size?: BrandLogoSize
  showRing?: boolean
}

export function BrandLogo({
  className,
  size = 'md',
  showRing = false,
  ...props
}: BrandLogoProps) {
  const brand = useBrand()

  return (
    <img
      src={brand.assets.logoPath}
      alt={`${brand.companyName} logo`}
      className={cn(
        'rounded-md object-contain',
        logoSizeStyles[size],
        showRing && 'border-border bg-card border p-1',
        className,
      )}
      {...props}
    />
  )
}
