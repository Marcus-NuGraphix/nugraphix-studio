import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import type { ServerResult } from '@/lib/errors'
import type { WebVitalMetric, WebVitalRating } from '@/lib/observability'
import {
  adminWebVitalOverviewSchema,
  captureWebVitalMetricSchema,
  dismissSystemNotificationSchema,
} from '@/features/observability/schemas/web-vitals'
import {
  countUnreadSystemNotifications,
  createWebVitalAlertNotification,
  insertWebVitalMetricSample,
  listRoutePerformanceSummaries,
  listSystemNotifications,
  listWebVitalMetricSummaries,
  markSystemNotificationRead,
} from '@/features/observability/server/repository'
import { fail, ok, toServerFail } from '@/lib/errors'
import { calculateWebVitalScore } from '@/lib/observability'
import { checkRateLimit } from '@/lib/rateLimit'
import {
  buildScopedRateLimitKey,
  getClientIpFromHeaders,
  getUserAgentFromHeaders,
} from '@/lib/server'

const getAdminSession = async () => {
  const { requireAdmin } = await import('@/features/auth/server/session.server')
  return requireAdmin()
}

const toScoreRatingsMap = (
  metricSummaries: Array<{
    metric: WebVitalMetric
    rating: WebVitalRating
  }>,
) => {
  const ratings: Partial<Record<WebVitalMetric, WebVitalRating>> = {}
  metricSummaries.forEach((summary) => {
    ratings[summary.metric] = summary.rating
  })
  return ratings
}

export const captureWebVitalMetricFn = createServerFn({ method: 'POST' })
  .inputValidator(captureWebVitalMetricSchema)
  .handler(
    async ({
      data,
    }): Promise<ServerResult<{ accepted: true; notificationCreated: boolean }>> => {
      try {
        const headers = getRequestHeaders()
        const rateLimitKey = buildScopedRateLimitKey({
          namespace: 'observability',
          scope: 'web-vitals-capture',
          headers,
          parts: [data.metric, data.routePath],
        })

        const rateLimitResult = await checkRateLimit({
          key: rateLimitKey,
          limit: 180,
          windowMs: 60_000,
        })

        if (!rateLimitResult.allowed) {
          return fail('RATE_LIMITED', 'Metric capture rate limit exceeded.')
        }

        await insertWebVitalMetricSample({
          id: crypto.randomUUID(),
          metricId: data.metricId,
          metric: data.metric,
          rating: data.rating,
          value: data.value,
          delta: data.delta,
          routePath: data.routePath,
          navigationType: data.navigationType,
          source: data.source,
          ipAddress: getClientIpFromHeaders(headers),
          userAgent: getUserAgentFromHeaders(headers),
        })

        const notification = await createWebVitalAlertNotification({
          metric: data.metric,
          rating: data.rating,
          routePath: data.routePath,
          value: data.value,
        })

        return ok({
          accepted: true,
          notificationCreated: Boolean(notification),
        })
      } catch (error) {
        if (error instanceof Response) throw error
        return toServerFail(error)
      }
    },
  )

export const getAdminWebVitalOverviewFn = createServerFn({ method: 'GET' })
  .inputValidator(adminWebVitalOverviewSchema)
  .handler(async ({ data }) => {
    await getAdminSession()

    const [metricSummaries, routeSummaries, notifications, unreadNotificationCount] =
      await Promise.all([
        listWebVitalMetricSummaries(data.windowHours),
        listRoutePerformanceSummaries({
          windowHours: data.windowHours,
          limit: 8,
        }),
        listSystemNotifications({
          limit: data.notificationLimit,
          includeRead: data.includeReadNotifications,
        }),
        countUnreadSystemNotifications(),
      ])

    const score = calculateWebVitalScore(toScoreRatingsMap(metricSummaries))
    const totalSamples = metricSummaries.reduce(
      (sum, item) => sum + item.sampleCount,
      0,
    )
    const totalPoorSamples = metricSummaries.reduce(
      (sum, item) => sum + item.poorCount,
      0,
    )

    return {
      windowHours: data.windowHours,
      score,
      totalSamples,
      totalPoorSamples,
      metricSummaries,
      routeSummaries,
      notifications,
      unreadNotificationCount,
    }
  })

export const dismissSystemNotificationFn = createServerFn({ method: 'POST' })
  .inputValidator(dismissSystemNotificationSchema)
  .handler(async ({ data }): Promise<ServerResult<{ id: string }>> => {
    try {
      await getAdminSession()
      const rows = await markSystemNotificationRead(data.id)

      if (!rows[0]) {
        return fail('NOT_FOUND', 'Notification not found.')
      }

      return ok({ id: rows[0].id })
    } catch (error) {
      if (error instanceof Response) throw error
      return toServerFail(error)
    }
  })
