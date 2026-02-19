import { RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { EmailMessageStatus, EmailTopic } from '@/features/email/model/types'
import { SearchInput } from '@/components/forms/search-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { emailMessageStatusValues, emailTopicValues } from '@/features/email/model/types'

type EmailFilterChange = {
  query?: string
  status?: EmailMessageStatus
  topic?: EmailTopic
  pageSize?: number
  page?: number
}

interface EmailFiltersProps {
  query?: string
  status?: EmailMessageStatus
  topic?: EmailTopic
  pageSize: number
  onChange: (next: EmailFilterChange) => void
}

const statusLabel: Record<EmailMessageStatus, string> = {
  queued: 'Queued',
  sent: 'Sent',
  failed: 'Failed',
  delivered: 'Delivered',
  bounced: 'Bounced',
  complained: 'Complained',
  opened: 'Opened',
  clicked: 'Clicked',
  suppressed: 'Suppressed',
}

const topicLabel: Record<EmailTopic, string> = {
  blog: 'Blog',
  press: 'Press',
  product: 'Product',
  security: 'Security',
  account: 'Account',
  contact: 'Contact',
}

export function EmailFilters({
  query,
  status,
  topic,
  pageSize,
  onChange,
}: EmailFiltersProps) {
  const [queryInput, setQueryInput] = useState(query ?? '')

  useEffect(() => {
    setQueryInput(query ?? '')
  }, [query])

  const activeFilterCount =
    Number(Boolean(query)) +
    Number(Boolean(status)) +
    Number(Boolean(topic)) +
    Number(pageSize !== 20)

  return (
    <div className="space-y-4 rounded-xl border border-border bg-muted/50 p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Delivery Filters
          </p>
          <p className="text-sm text-muted-foreground">
            Narrow by recipient, template, status stage, and message topic.
          </p>
        </div>
        <Badge className="w-fit border border-border bg-card text-muted-foreground">
          {activeFilterCount} active filter{activeFilterCount === 1 ? '' : 's'}
        </Badge>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row">
        <SearchInput
          value={queryInput}
          onValueChange={setQueryInput}
          placeholder="Search by recipient, subject, or template key"
          containerClassName="lg:max-w-md"
          aria-label="Search email messages"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              onChange({ query: queryInput.trim() || undefined, page: 1 })
            }
          }}
        />
        <Button
          onClick={() =>
            onChange({ query: queryInput.trim() || undefined, page: 1 })
          }
        >
          Apply
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setQueryInput('')
            onChange({
              query: undefined,
              status: undefined,
              topic: undefined,
              pageSize: 20,
              page: 1,
            })
          }}
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <Select
          value={status ?? 'all'}
          onValueChange={(value) =>
            onChange({
              status: value === 'all' ? undefined : (value as EmailMessageStatus),
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {emailMessageStatusValues.map((value) => (
              <SelectItem key={value} value={value}>
                {statusLabel[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={topic ?? 'all'}
          onValueChange={(value) =>
            onChange({
              topic: value === 'all' ? undefined : (value as EmailTopic),
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All topics</SelectItem>
            {emailTopicValues.map((value) => (
              <SelectItem key={value} value={value}>
                {topicLabel[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(pageSize)}
          onValueChange={(value) =>
            onChange({
              pageSize: Number(value),
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Rows" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 rows</SelectItem>
            <SelectItem value="20">20 rows</SelectItem>
            <SelectItem value="50">50 rows</SelectItem>
            <SelectItem value="100">100 rows</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-end">
          <p className="text-xs text-muted-foreground">
            Use the delivery funnel to quickly pin list status to queued, sent,
            delivered, opened, or clicked stages.
          </p>
        </div>
      </div>
    </div>
  )
}
