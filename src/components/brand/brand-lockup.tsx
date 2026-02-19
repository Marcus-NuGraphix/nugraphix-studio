import type { ComponentPropsWithoutRef } from 'react'
import type {BrandLogoSize} from '@/components/brand/brand-logo';
import { BrandLogo  } from '@/components/brand/brand-logo'
import { BrandWordmark } from '@/components/brand/brand-wordmark'
import { cn } from '@/lib/utils'

interface BrandLockupProps extends ComponentPropsWithoutRef<'div'> {
  compact?: boolean
  includeTagline?: boolean
  logoSize?: BrandLogoSize
  logoClassName?: string
  textClassName?: string
}

export function BrandLockup({
  compact = false,
  includeTagline = false,
  logoSize = compact ? 'sm' : 'md',
  logoClassName,
  textClassName,
  className,
  ...props
}: BrandLockupProps) {
  return (
    <div className={cn('inline-flex items-center gap-2.5', className)} {...props}>
      <BrandLogo
        size={logoSize}
        className={logoClassName}
        showRing={compact ? false : true}
      />
      <BrandWordmark
        compact={compact}
        includeTagline={includeTagline}
        className={cn(compact ? 'text-base' : 'text-lg', textClassName)}
      />
    </div>
  )
}
