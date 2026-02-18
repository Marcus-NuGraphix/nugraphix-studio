import { createFileRoute } from '@tanstack/react-router'
import { Activity, ShieldCheck, Users } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { StatCard, WebPerformanceDashboard } from '@/components/metrics'

export const Route = createFileRoute('/admin/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Operational summary and release-health visibility for admin workflows."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Content pipeline"
          value="14 active drafts"
          description="Editorial flow remains stable this week."
          tone="info"
          icon={Activity}
          trend={{ label: '+2 vs last week', direction: 'up' }}
        />
        <StatCard
          label="User access reviews"
          value="3 pending"
          description="Role and session governance queue."
          tone="warning"
          icon={Users}
        />
        <StatCard
          label="Security posture"
          value="All checks passing"
          description="Latest auth, rate-limit, and incident gates are green."
          tone="success"
          icon={ShieldCheck}
        />
      </div>

      <WebPerformanceDashboard />
    </section>
  )
}
