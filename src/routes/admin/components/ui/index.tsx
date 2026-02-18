import { createFileRoute, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { NotificationFeedItem } from '@/components/feedback'
import type { SystemNotificationItem } from '@/features/observability'
import { NotificationCenter } from '@/components/feedback'
import { PageHeader } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  dismissSystemNotificationFn,
  getAdminWebVitalOverviewFn,
} from '@/features/observability'

interface AdminUiComponentsLoaderData {
  notifications: Array<SystemNotificationItem>
}

export const Route = createFileRoute('/admin/components/ui/')({
  loader: async (): Promise<AdminUiComponentsLoaderData> => {
    try {
      const data = await getAdminWebVitalOverviewFn({
        data: {
          windowHours: 24,
          notificationLimit: 12,
          includeReadNotifications: false,
        },
      })

      return {
        notifications: data.notifications,
      }
    } catch (error) {
      if (error instanceof Response) throw error
      return {
        notifications: [],
      }
    }
  },
  component: AdminUiComponentsPage,
})

function AdminUiComponentsPage() {
  const router = useRouter()
  const data = Route.useLoaderData()
  const feedItems: Array<NotificationFeedItem> = data.notifications.map(
    (notification) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      description: notification.description,
      actionLabel: 'Acknowledge',
    }),
  )

  return (
    <section className="space-y-6">
      <PageHeader
        title="UI Primitives"
        description="Foundation-level controls for consistent interactions and visual standards across the platform."
      />

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Primitive System</CardTitle>
          <CardDescription>
            Inputs, overlays, tables, and feedback components that power both
            marketing and admin views.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            This area will provide grouped previews, usage constraints, and
            token alignment checks for `src/components/ui/*`.
          </p>
          <p>Live demo: expandable notification surfaces built from primitives.</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Feedback Composition Example</CardTitle>
          <CardDescription>
            Live notification feed sourced from persisted observability signals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationCenter
            mode="inbox"
            items={feedItems}
            onDismissItem={async (notificationId) => {
              const result = await dismissSystemNotificationFn({
                data: { id: notificationId },
              })

              if (!result.ok) {
                toast.error(result.error.message)
                return
              }

              toast.success('Notification dismissed.')
              await router.invalidate({ sync: true })
            }}
            onActionItem={async (notification) => {
              const result = await dismissSystemNotificationFn({
                data: { id: notification.id },
              })

              if (!result.ok) {
                toast.error(result.error.message)
                return
              }

              toast.success('Notification acknowledged.')
              await router.invalidate({ sync: true })
            }}
          />
        </CardContent>
      </Card>
    </section>
  )
}
