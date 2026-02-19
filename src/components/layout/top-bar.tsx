import type { ReactNode } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface TopBarProps {
  title?: string
  subtitle?: string
  leading?: ReactNode
  trailing?: ReactNode
  className?: string
}

export function TopBar({
  title,
  subtitle,
  leading,
  trailing,
  className,
}: TopBarProps) {
  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 sm:px-6',
        isMobile ? 'flex-col items-start' : 'h-16',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {leading}
        {(title || subtitle) && (
          <div className="min-w-0">
            {title ? (
              <h1 className="truncate text-sm font-semibold text-foreground sm:text-base">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {subtitle}
              </p>
            ) : null}
          </div>
        )}
      </div>
      {trailing ? (
        <div
          className={cn(
            'flex items-center gap-2',
            isMobile ? 'w-full justify-end' : 'shrink-0',
          )}
        >
          {trailing}
        </div>
      ) : null}
    </div>
  )
}
