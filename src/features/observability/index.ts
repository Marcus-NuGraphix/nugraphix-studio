// Client
export {
  captureWebVitalMetricFn,
  dismissSystemNotificationFn,
  getAdminWebVitalOverviewFn,
} from '@/features/observability/client/observability'

// Model
export type {
  AdminWebVitalOverview,
  RoutePerformanceSummary,
  SystemNotificationItem,
  SystemNotificationType,
  WebVitalSummary,
} from '@/features/observability/model/types'

// Schemas
export {
  adminWebVitalOverviewSchema,
  captureWebVitalMetricSchema,
  dismissSystemNotificationSchema,
} from '@/features/observability/schemas/web-vitals'

// UI
export { WebVitalsReporter } from '@/features/observability/ui/web-vitals-reporter'
