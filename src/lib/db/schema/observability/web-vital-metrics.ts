import { doublePrecision, index, pgTable, text } from 'drizzle-orm/pg-core'
import {
  webVitalMetric,
  webVitalRating,
} from '@/lib/db/schema/shared/enums'
import { timestampUtc } from '@/lib/db/schema/shared/timestamps'

export const webVitalMetricSample = pgTable(
  'web_vital_metric_sample',
  {
    id: text('id').primaryKey(),
    metricId: text('metric_id').notNull(),
    metric: webVitalMetric('metric').notNull(),
    rating: webVitalRating('rating').notNull(),
    value: doublePrecision('value').notNull(),
    delta: doublePrecision('delta').notNull(),
    routePath: text('route_path').notNull(),
    navigationType: text('navigation_type').notNull(),
    source: text('source').default('web-vitals').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('web_vital_metric_sample_metric_idx').on(table.metric),
    index('web_vital_metric_sample_rating_idx').on(table.rating),
    index('web_vital_metric_sample_route_path_idx').on(table.routePath),
    index('web_vital_metric_sample_created_at_idx').on(table.createdAt),
    index('web_vital_metric_sample_metric_id_idx').on(table.metricId),
  ],
)
