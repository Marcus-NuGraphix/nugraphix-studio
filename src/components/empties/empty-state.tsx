import { ArrowRight, InboxIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { cn } from '@/lib/utils'

interface EmptyStateAction {
  label: string
  onClick: () => void
  icon?: LucideIcon
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  disabled?: boolean
}

interface EmptyStateProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  icon?: LucideIcon
  title: string
  description?: string
  action?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  tone?: 'default' | 'subtle' | 'danger'
  children?: ReactNode
}

export function EmptyState({
  icon: Icon = InboxIcon,
  title,
  description,
  action,
  secondaryAction,
  tone = 'default',
  children,
  className,
  ...props
}: EmptyStateProps) {
  const ActionIcon = action?.icon ?? ArrowRight
  const SecondaryActionIcon = secondaryAction?.icon

  return (
    <Empty
      className={cn(
        'rounded-xl border border-dashed px-6 py-10',
        tone === 'default' && 'border-border bg-card',
        tone === 'subtle' && 'border-border bg-muted/30',
        tone === 'danger' && 'border-destructive/30 bg-destructive/5',
        className,
      )}
      {...props}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="size-5" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>

      {(action || secondaryAction || children) && (
        <EmptyContent>
          {children}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {secondaryAction ? (
              <Button
                type="button"
                variant={secondaryAction.variant ?? 'outline'}
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled}
              >
                {SecondaryActionIcon ? (
                  <SecondaryActionIcon className="size-4" />
                ) : null}
                {secondaryAction.label}
              </Button>
            ) : null}

            {action ? (
              <Button
                type="button"
                variant={action.variant ?? 'default'}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                <ActionIcon className="size-4" />
                {action.label}
              </Button>
            ) : null}
          </div>
        </EmptyContent>
      )}
    </Empty>
  )
}
