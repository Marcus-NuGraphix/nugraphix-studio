'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Info,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationTemplate {
  title: string
  message: string
  description: string
  actionLabel: string
}

interface NotificationCenterProps {
  className?: string
  autoDismissMs?: number
  templates?: Partial<Record<NotificationType, NotificationTemplate>>
  onAction?: (type: NotificationType) => void
}

type ActiveNotification = {
  id: string
  type: NotificationType
}

interface ToneStyle {
  iconContainerClassName: string
  badgeClassName: string
}

const DEFAULT_TEMPLATES: Record<NotificationType, NotificationTemplate> = {
  success: {
    title: 'Success',
    message: 'Operation completed successfully.',
    description:
      'Your changes are now live across the platform and visible to your team.',
    actionLabel: 'View details',
  },
  error: {
    title: 'Error',
    message: 'Unable to complete this request.',
    description:
      'Retry the action, then escalate if the issue persists after validation checks.',
    actionLabel: 'Retry',
  },
  warning: {
    title: 'Warning',
    message: 'Review this action before continuing.',
    description:
      'The selected change may impact downstream workflows and content delivery.',
    actionLabel: 'Review impact',
  },
  info: {
    title: 'Information',
    message: 'A new workflow update is available.',
    description:
      'Open details to review what changed and how the update affects your process.',
    actionLabel: 'Read update',
  },
}

const BUTTON_LABELS: Record<NotificationType, string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
}

const ICONS: Record<NotificationType, LucideIcon> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const TONE_STYLES: Record<NotificationType, ToneStyle> = {
  success: {
    iconContainerClassName: 'border-accent/40 bg-accent/15 text-accent',
    badgeClassName: 'border-accent/40 bg-accent/15 text-foreground',
  },
  error: {
    iconContainerClassName:
      'border-destructive/35 bg-destructive/10 text-destructive',
    badgeClassName: 'border-destructive/35 bg-destructive/10 text-destructive',
  },
  warning: {
    iconContainerClassName: 'border-border bg-secondary text-foreground',
    badgeClassName: 'border-border bg-secondary text-secondary-foreground',
  },
  info: {
    iconContainerClassName: 'border-primary/35 bg-primary/10 text-primary',
    badgeClassName: 'border-primary/35 bg-primary/10 text-foreground',
  },
}

const createNotificationId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return Math.random().toString(36).slice(2, 9)
}

export function NotificationCenter({
  className,
  autoDismissMs = 8_000,
  templates,
  onAction,
}: NotificationCenterProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [notifications, setNotifications] = useState<Array<ActiveNotification>>(
    [],
  )
  const timeoutHandlesRef = useRef<Map<string, number>>(new Map())

  const mergedTemplates = useMemo(
    () => ({
      ...DEFAULT_TEMPLATES,
      ...templates,
    }),
    [templates],
  )

  const removeNotification = useCallback((id: string) => {
    const timeoutHandle = timeoutHandlesRef.current.get(id)
    if (timeoutHandle) {
      window.clearTimeout(timeoutHandle)
      timeoutHandlesRef.current.delete(id)
    }

    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    )
  }, [])

  const addNotification = useCallback(
    (type: NotificationType) => {
      const id = createNotificationId()
      setNotifications((prev) => [...prev, { id, type }])

      const timeoutHandle = window.setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== id),
        )
        timeoutHandlesRef.current.delete(id)
      }, autoDismissMs)

      timeoutHandlesRef.current.set(id, timeoutHandle)
    },
    [autoDismissMs],
  )

  useEffect(
    () => () => {
      timeoutHandlesRef.current.forEach((timeoutHandle) => {
        window.clearTimeout(timeoutHandle)
      })
      timeoutHandlesRef.current.clear()
    },
    [],
  )

  return (
    <section className={cn('relative space-y-4', className)}>
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Notification simulation
        </h2>
        <p className="text-sm text-muted-foreground">
          Trigger contextual notifications and expand details for recovery
          actions.
        </p>
      </header>

      <div className="relative rounded-2xl border border-border bg-card/60 p-4 sm:p-5">
        <div
          aria-live="polite"
          role="status"
          className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3"
        >
          <div className="pointer-events-auto mx-auto flex max-w-xl flex-col gap-3">
            <AnimatePresence initial={false}>
              {notifications.map((notification) => {
                const template = mergedTemplates[notification.type]
                const icon = ICONS[notification.type]
                const toneStyle = TONE_STYLES[notification.type]

                return (
                  <NotificationBar
                    key={notification.id}
                    id={notification.id}
                    type={notification.type}
                    template={template}
                    icon={icon}
                    toneStyle={toneStyle}
                    prefersReducedMotion={prefersReducedMotion}
                    onDismiss={() => removeNotification(notification.id)}
                    onAction={() => onAction?.(notification.type)}
                  />
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid min-h-64 content-center gap-3 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {(['success', 'error', 'warning', 'info'] as const).map((type) => (
            <TriggerButton
              key={type}
              type={type}
              label={BUTTON_LABELS[type]}
              prefersReducedMotion={prefersReducedMotion}
              onClick={() => addNotification(type)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface TriggerButtonProps {
  type: NotificationType
  label: string
  prefersReducedMotion: boolean
  onClick: () => void
}

function TriggerButton({
  type,
  label,
  prefersReducedMotion,
  onClick,
}: TriggerButtonProps) {
  const Icon = ICONS[type]
  const toneStyle = TONE_STYLES[type]

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
      whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
      className="rounded-xl border border-border bg-background/80 p-4 text-left transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span
          className={cn(
            'inline-flex size-8 items-center justify-center rounded-full border',
            toneStyle.iconContainerClassName,
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
    </motion.button>
  )
}

interface NotificationBarProps {
  id: string
  type: NotificationType
  template: NotificationTemplate
  icon: LucideIcon
  toneStyle: ToneStyle
  prefersReducedMotion: boolean
  onDismiss: () => void
  onAction: () => void
}

function NotificationBar({
  id,
  type,
  template,
  icon: Icon,
  toneStyle,
  prefersReducedMotion,
  onDismiss,
  onAction,
}: NotificationBarProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      role="listitem"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.25,
        ease: 'easeOut',
      }}
    >
      <Card className="border-border bg-popover/95 p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border',
              toneStyle.iconContainerClassName,
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <Badge
                  variant="outline"
                  className={cn(
                    'h-5 border text-[10px]',
                    toneStyle.badgeClassName,
                  )}
                >
                  {type}
                </Badge>
                <h3 className="text-sm font-semibold text-popover-foreground">
                  {template.title}
                </h3>
                <p className="text-sm text-popover-foreground/80">
                  {template.message}
                </p>
              </div>

              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="rounded-full"
                onClick={() => setExpanded((prev) => !prev)}
                aria-expanded={expanded}
                aria-controls={`notification-details-${id}`}
              >
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.2,
                    ease: 'easeOut',
                  }}
                  className="inline-flex"
                >
                  <ChevronDown className="size-4" aria-hidden="true" />
                </motion.span>
                <span className="sr-only">
                  {expanded ? 'Hide details' : 'Show details'}
                </span>
              </Button>
            </div>

            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  id={`notification-details-${id}`}
                  key="details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.2,
                    ease: 'easeOut',
                  }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 border-t border-border/70 pt-3">
                    <p className="text-sm text-popover-foreground/80">
                      {template.description}
                    </p>
                    <div className="inline-flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={onAction}
                      >
                        {template.actionLabel}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="rounded-full"
                        onClick={onDismiss}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="rounded-full"
            onClick={onDismiss}
            aria-label={`Dismiss ${type} notification`}
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
