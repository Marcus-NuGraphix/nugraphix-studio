import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Activity, Layout, ShieldCheck, Users, Zap } from 'lucide-react'
import type {
  AdminWebVitalOverview,
  WebVitalSummary,
} from '@/features/observability'
import { PageHeader } from '@/components/layout'
import { StatCard, WebPerformanceDashboard } from '@/components/metrics'
import { getAdminWebVitalOverviewFn } from '@/features/observability'
import { getWebVitalMetricLabel, getWebVitalMetricUnit } from '@/lib/observability'

const emptyOverview: AdminWebVitalOverview = {
  windowHours: 24,
  score: 0,
  totalSamples: 0,
  totalPoorSamples: 0,
  metricSummaries: [],
  routeSummaries: [],
  notifications: [],
  unreadNotificationCount: 0,
}

export const Route = createFileRoute('/admin/dashboard/')({
  loader: async (): Promise<AdminWebVitalOverview> => {
    try {
      return await getAdminWebVitalOverviewFn({
        data: {
          windowHours: 24,
          notificationLimit: 12,
          includeReadNotifications: false,
        },
      })
    } catch (error) {
      if (error instanceof Response) throw error
      return emptyOverview
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const router = useRouter()
  const overview = Route.useLoaderData()
  const vitalCards = mapVitalSummaries(overview.metricSummaries)
  const routeResources = overview.routeSummaries.map((item) => ({
    name: item.routePath,
    type: 'other' as const,
    time: `${Math.round(item.p75LcpValue)}ms`,
    size: `${item.sampleCount} samples`,
  }))

  return (
    <section className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Operational summary and release-health visibility for admin workflows."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Web vital samples (24h)"
          value={overview.totalSamples}
          description="Captured from real browser sessions."
          tone="info"
          icon={Activity}
          trend={{
            label:
              overview.totalSamples > 0
                ? 'Telemetry active'
                : 'No telemetry yet',
            direction: 'up',
          }}
        />
        <StatCard
          label="Poor metric signals"
          value={overview.totalPoorSamples}
          description="Events currently breaching poor thresholds."
          tone={overview.totalPoorSamples > 0 ? 'destructive' : 'success'}
          icon={Users}
        />
        <StatCard
          label="Unread notifications"
          value={overview.unreadNotificationCount}
          description="Persisted system alerts awaiting review."
          tone={overview.unreadNotificationCount > 0 ? 'warning' : 'success'}
          icon={ShieldCheck}
        />
      </div>

      <WebPerformanceDashboard
        score={overview.score}
        scoreDescription={`Performance score across ${overview.windowHours}h window.`}
        vitals={vitalCards.length > 0 ? vitalCards : undefined}
        resources={routeResources.length > 0 ? routeResources : undefined}
        onRunAudit={() => {
          void router.invalidate({ sync: true })
        }}
        onExport={() => {
          // Placeholder for future CSV export.
        }}
      />
    </section>
  )
}

const metricIconMap = {
  cls: <Layout className="size-5" />,
  fcp: <Layout className="size-5" />,
  inp: <Zap className="size-5" />,
  lcp: <Layout className="size-5" />,
  ttfb: <Activity className="size-5" />,
} as const

const toMetricDescription = (summary: WebVitalSummary) => {
  const poorSignals =
    summary.poorCount > 0 ? ` ${summary.poorCount} poor samples detected.` : ''
  return `P75 based on ${summary.sampleCount} samples.${poorSignals}`
}

const mapVitalSummaries = (summaries: Array<WebVitalSummary>) =>
  summaries.map((summary) => ({
    label: getWebVitalMetricLabel(summary.metric),
    value:
      summary.metric === 'cls'
        ? summary.p75Value.toFixed(2)
        : String(Math.round(summary.p75Value)),
    unit: getWebVitalMetricUnit(summary.metric) || undefined,
    description: toMetricDescription(summary),
    status: summary.rating,
    icon: metricIconMap[summary.metric],
  }))
