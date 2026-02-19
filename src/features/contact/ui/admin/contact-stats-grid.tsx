import { CheckCircle2, CircleDot, ClipboardCheck, Inbox, UserRound } from 'lucide-react'
import type { ContactStats } from '@/features/contact/model/types'
import { StatCard } from '@/components/metrics/stat-card'

interface ContactStatsGridProps {
  stats: ContactStats
}

export function ContactStatsGrid({ stats }: ContactStatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <StatCard
        label="Total Leads"
        value={stats.total}
        description="All tracked submissions in CRM."
        icon={Inbox}
        tone="neutral"
      />
      <StatCard
        label="New Leads"
        value={stats.new}
        description="Unreviewed submissions requiring triage."
        icon={CircleDot}
        tone={stats.new > 0 ? 'info' : 'neutral'}
      />
      <StatCard
        label="Qualified Pipeline"
        value={stats.qualified + stats.proposal}
        description="Qualified and proposal-stage opportunities."
        icon={ClipboardCheck}
        tone="success"
      />
      <StatCard
        label="Closed Won"
        value={stats.closedWon}
        description="Leads converted into active engagements."
        icon={CheckCircle2}
        tone="success"
      />
      <StatCard
        label="Unassigned"
        value={stats.unassigned}
        description="Submissions awaiting owner assignment."
        icon={UserRound}
        tone={stats.unassigned > 0 ? 'warning' : 'neutral'}
      />
    </div>
  )
}
