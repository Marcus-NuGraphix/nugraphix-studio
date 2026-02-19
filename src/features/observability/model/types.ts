import type {
  WebVitalMetric,
  WebVitalRating,
} from '@/lib/observability/web-vitals'

export type SystemNotificationType = 'success' | 'info' | 'warning' | 'error'

export interface WebVitalSummary {
  metric: WebVitalMetric
  p75Value: number
  averageValue: number
  rating: WebVitalRating
  sampleCount: number
  poorCount: number
  needsImprovementCount: number
  goodCount: number
}

export interface RoutePerformanceSummary {
  routePath: string
  sampleCount: number
  poorCount: number
  p75LcpValue: number
}

export interface SystemNotificationItem {
  id: string
  type: SystemNotificationType
  title: string
  message: string
  description: string | null
  source: string
  metadata: Record<string, string | number | boolean | null>
  createdAt: Date
  readAt: Date | null
}

export interface AdminWebVitalOverview {
  windowHours: number
  score: number
  totalSamples: number
  totalPoorSamples: number
  metricSummaries: Array<WebVitalSummary>
  routeSummaries: Array<RoutePerformanceSummary>
  notifications: Array<SystemNotificationItem>
  unreadNotificationCount: number
}
