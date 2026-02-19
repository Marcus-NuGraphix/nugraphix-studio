import { z } from 'zod'
import {
  webVitalMetricValues,
  webVitalRatingValues,
} from '@/lib/observability/web-vitals'

export const webVitalMetricSchema = z.enum(webVitalMetricValues)
export const webVitalRatingSchema = z.enum(webVitalRatingValues)

export const captureWebVitalMetricSchema = z.object({
  metricId: z.string().trim().min(1).max(128),
  metric: webVitalMetricSchema,
  rating: webVitalRatingSchema,
  value: z.number().finite().min(0).max(120_000),
  delta: z.number().finite().min(-10_000).max(120_000),
  routePath: z.string().trim().min(1).max(256),
  navigationType: z.string().trim().min(1).max(64),
  source: z.string().trim().min(1).max(64).default('web-vitals'),
})

export const adminWebVitalOverviewSchema = z.object({
  windowHours: z.coerce.number().int().min(1).max(168).default(24),
  notificationLimit: z.coerce.number().int().min(1).max(100).default(12),
  includeReadNotifications: z.boolean().default(false),
})

export const dismissSystemNotificationSchema = z.object({
  id: z.string().trim().min(1).max(128),
})
