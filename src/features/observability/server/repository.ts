import { and, desc, eq, gte, isNull, sql } from 'drizzle-orm'
import type {
  RoutePerformanceSummary,
  SystemNotificationItem,
  SystemNotificationType,
  WebVitalSummary,
} from '@/features/observability/model/types'
import type { WebVitalMetric, WebVitalRating } from '@/lib/observability'
import { db } from '@/lib/db'
import { systemNotification, webVitalMetricSample } from '@/lib/db/schema'
import {
  getWebVitalMetricLabel,
  resolveWebVitalRating,
  toNotificationTypeFromRating,
} from '@/lib/observability'

const toSafeNumber = (value: unknown) => {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    return Number.parseFloat(value)
  }

  if (typeof value === 'bigint') {
    return Number(value)
  }

  return 0
}

const notificationTitleByType: Record<SystemNotificationType, string> = {
  success: 'Performance Recovered',
  info: 'Performance Signal',
  warning: 'Performance Warning',
  error: 'Performance Incident',
}

const metricValueLabel = (metric: WebVitalMetric, value: number) => {
  if (metric === 'cls') {
    return value.toFixed(2)
  }

  return `${Math.round(value)}ms`
}

export const insertWebVitalMetricSample = async (input: {
  id: string
  metricId: string
  metric: WebVitalMetric
  rating: WebVitalRating
  value: number
  delta: number
  routePath: string
  navigationType: string
  source: string
  ipAddress: string | null
  userAgent: string | null
}) =>
  db.insert(webVitalMetricSample).values({
    id: input.id,
    metricId: input.metricId,
    metric: input.metric,
    rating: input.rating,
    value: input.value,
    delta: input.delta,
    routePath: input.routePath,
    navigationType: input.navigationType,
    source: input.source,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  })

const findRecentMatchingNotification = ({
  type,
  title,
  message,
  source,
  dedupeWindowMinutes,
}: {
  type: SystemNotificationType
  title: string
  message: string
  source: string
  dedupeWindowMinutes: number
}) =>
  db.query.systemNotification.findFirst({
    where: and(
      eq(systemNotification.type, type),
      eq(systemNotification.title, title),
      eq(systemNotification.message, message),
      eq(systemNotification.source, source),
      gte(
        systemNotification.createdAt,
        new Date(Date.now() - dedupeWindowMinutes * 60_000),
      ),
    ),
  })

export const createWebVitalAlertNotification = async ({
  metric,
  rating,
  routePath,
  value,
  dedupeWindowMinutes = 30,
}: {
  metric: WebVitalMetric
  rating: WebVitalRating
  routePath: string
  value: number
  dedupeWindowMinutes?: number
}) => {
  if (rating === 'good') {
    return null
  }

  const type = toNotificationTypeFromRating(rating)
  const title = notificationTitleByType[type]
  const message = `${getWebVitalMetricLabel(metric)} reached ${metricValueLabel(metric, value)} on ${routePath}.`
  const description =
    type === 'error'
      ? 'AA thresholds and interaction performance are at risk. Investigate route payload and render path.'
      : 'Metric trend moved outside the good range. Review route behavior and recent UI changes.'

  const existing = await findRecentMatchingNotification({
    type,
    title,
    message,
    source: 'web-vitals',
    dedupeWindowMinutes,
  })

  if (existing) {
    return existing
  }

  const id = crypto.randomUUID()
  await db.insert(systemNotification).values({
    id,
    type,
    title,
    message,
    description,
    source: 'web-vitals',
    metadata: {
      metric,
      rating,
      routePath,
      value,
    },
  })

  return db.query.systemNotification.findFirst({
    where: eq(systemNotification.id, id),
  })
}

interface MetricSummaryRow {
  metric: string
  p75_value: number | string
  avg_value: number | string
  sample_count: number | string
  poor_count: number | string
  needs_improvement_count: number | string
  good_count: number | string
}

export const listWebVitalMetricSummaries = async (
  windowHours: number,
): Promise<Array<WebVitalSummary>> => {
  const windowStart = new Date(Date.now() - windowHours * 3_600_000)
  const result = await db.execute(sql<MetricSummaryRow>`
    SELECT
      metric,
      percentile_cont(0.75) WITHIN GROUP (ORDER BY value)::double precision AS p75_value,
      avg(value)::double precision AS avg_value,
      COUNT(*)::int AS sample_count,
      COUNT(*) FILTER (WHERE rating = 'poor')::int AS poor_count,
      COUNT(*) FILTER (WHERE rating = 'needs-improvement')::int AS needs_improvement_count,
      COUNT(*) FILTER (WHERE rating = 'good')::int AS good_count
    FROM web_vital_metric_sample
    WHERE created_at >= ${windowStart}
    GROUP BY metric
  `)

  return result.rows.map((row) => {
    const metric = row.metric as WebVitalMetric
    const p75Value = toSafeNumber(row.p75_value)

    return {
      metric,
      p75Value,
      averageValue: toSafeNumber(row.avg_value),
      rating: resolveWebVitalRating(metric, p75Value),
      sampleCount: toSafeNumber(row.sample_count),
      poorCount: toSafeNumber(row.poor_count),
      needsImprovementCount: toSafeNumber(row.needs_improvement_count),
      goodCount: toSafeNumber(row.good_count),
    }
  })
}

interface RouteSummaryRow {
  route_path: string
  sample_count: number | string
  poor_count: number | string
  p75_lcp_value: number | string
}

export const listRoutePerformanceSummaries = async ({
  windowHours,
  limit,
}: {
  windowHours: number
  limit: number
}): Promise<Array<RoutePerformanceSummary>> => {
  const windowStart = new Date(Date.now() - windowHours * 3_600_000)
  const result = await db.execute(sql<RouteSummaryRow>`
    SELECT
      route_path,
      COUNT(*)::int AS sample_count,
      COUNT(*) FILTER (WHERE rating = 'poor')::int AS poor_count,
      percentile_cont(0.75) WITHIN GROUP (ORDER BY value)::double precision AS p75_lcp_value
    FROM web_vital_metric_sample
    WHERE created_at >= ${windowStart}
      AND metric = 'lcp'
    GROUP BY route_path
    ORDER BY poor_count DESC, sample_count DESC, p75_lcp_value DESC
    LIMIT ${limit}
  `)

  return result.rows.map((row) => ({
    routePath: String(row.route_path),
    sampleCount: toSafeNumber(row.sample_count),
    poorCount: toSafeNumber(row.poor_count),
    p75LcpValue: toSafeNumber(row.p75_lcp_value),
  }))
}

export const listSystemNotifications = async ({
  limit,
  includeRead,
}: {
  limit: number
  includeRead: boolean
}): Promise<Array<SystemNotificationItem>> =>
  db.query.systemNotification.findMany({
    where: includeRead ? undefined : isNull(systemNotification.readAt),
    orderBy: [desc(systemNotification.createdAt)],
    limit,
  })

export const markSystemNotificationRead = async (id: string) =>
  db
    .update(systemNotification)
    .set({ readAt: new Date() })
    .where(eq(systemNotification.id, id))
    .returning({
      id: systemNotification.id,
    })

export const countUnreadSystemNotifications = async () => {
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(systemNotification)
    .where(isNull(systemNotification.readAt))

  return Number(row.count)
}
