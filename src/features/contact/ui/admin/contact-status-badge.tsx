import type { ContactSubmissionStatus } from '@/features/contact/model/types'
import { Badge } from '@/components/ui/badge'

const statusLabel: Record<ContactSubmissionStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  'closed-won': 'Closed Won',
  'closed-lost': 'Closed Lost',
}

const statusClassName: Record<ContactSubmissionStatus, string> = {
  new: 'border border-primary/30 bg-primary/10 text-primary',
  contacted: 'border border-ring/30 bg-muted text-foreground',
  qualified: 'border border-accent/30 bg-accent/10 text-accent',
  proposal: 'border border-border bg-secondary text-muted-foreground',
  'closed-won': 'border border-accent/40 bg-accent/15 text-accent',
  'closed-lost': 'border border-destructive/30 bg-destructive/10 text-destructive',
}

interface ContactStatusBadgeProps {
  status: ContactSubmissionStatus
}

export function ContactStatusBadge({ status }: ContactStatusBadgeProps) {
  return <Badge className={statusClassName[status]}>{statusLabel[status]}</Badge>
}
