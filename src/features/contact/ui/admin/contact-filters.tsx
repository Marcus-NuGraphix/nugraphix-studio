import { RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type {
  ContactAdminSort,
  ContactAssignmentFilter,
} from '@/features/contact/model/filters'
import type { ContactSubmissionStatus } from '@/features/contact/model/types'
import { SearchInput } from '@/components/forms/search-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  contactServiceInterestValues,
  contactUrgencyValues,
  serviceInterestLabels,
  urgencyLabels,
} from '@/features/contact/model/lead-form'
import { contactAdminSortValues } from '@/features/contact/model/filters'
import { contactSubmissionStatusValues } from '@/features/contact/model/types'

type ContactFilterChange = {
  query?: string
  status?: ContactSubmissionStatus
  serviceInterest?: (typeof contactServiceInterestValues)[number]
  urgency?: (typeof contactUrgencyValues)[number]
  assignment?: ContactAssignmentFilter
  fromDate?: string
  toDate?: string
  sort?: ContactAdminSort
  pageSize?: number
  page?: number
}

interface ContactFiltersProps {
  query?: string
  status?: ContactSubmissionStatus
  serviceInterest?: (typeof contactServiceInterestValues)[number]
  urgency?: (typeof contactUrgencyValues)[number]
  assignment?: ContactAssignmentFilter
  fromDate?: string
  toDate?: string
  sort: ContactAdminSort
  pageSize: number
  onChange: (next: ContactFilterChange) => void
}

const statusLabel: Record<ContactSubmissionStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  'closed-won': 'Closed Won',
  'closed-lost': 'Closed Lost',
}

const toDateInputValue = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 10) : ''

const toStartDateISOString = (value: string) =>
  `${value.trim()}T00:00:00.000Z`

const toEndDateISOString = (value: string) =>
  `${value.trim()}T23:59:59.999Z`

export function ContactFilters({
  query,
  status,
  serviceInterest,
  urgency,
  assignment,
  fromDate,
  toDate,
  sort,
  pageSize,
  onChange,
}: ContactFiltersProps) {
  const [queryInput, setQueryInput] = useState(query ?? '')
  const [fromDateInput, setFromDateInput] = useState(toDateInputValue(fromDate))
  const [toDateInput, setToDateInput] = useState(toDateInputValue(toDate))

  useEffect(() => {
    setQueryInput(query ?? '')
  }, [query])

  useEffect(() => {
    setFromDateInput(toDateInputValue(fromDate))
    setToDateInput(toDateInputValue(toDate))
  }, [fromDate, toDate])

  const hasDateRange = useMemo(
    () => Boolean(fromDateInput.trim() || toDateInput.trim()),
    [fromDateInput, toDateInput],
  )

  const activeFilterCount =
    Number(Boolean(query)) +
    Number(Boolean(status)) +
    Number(Boolean(serviceInterest)) +
    Number(Boolean(urgency)) +
    Number(Boolean(assignment)) +
    Number(Boolean(fromDate)) +
    Number(Boolean(toDate)) +
    Number(sort !== 'created-desc') +
    Number(pageSize !== 20)

  return (
    <div className="space-y-4 rounded-xl border border-border bg-muted/50 p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Lead Filters
          </p>
          <p className="text-sm text-muted-foreground">
            Refine submissions by status, intent, urgency, assignment, and time.
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
          placeholder="Search by name, email, subject, or message"
          containerClassName="lg:max-w-md"
          aria-label="Search contact submissions"
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
            setFromDateInput('')
            setToDateInput('')
            onChange({
              query: undefined,
              status: undefined,
              serviceInterest: undefined,
              urgency: undefined,
              assignment: undefined,
              fromDate: undefined,
              toDate: undefined,
              sort: 'created-desc',
              pageSize: 20,
              page: 1,
            })
          }}
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        <Select
          value={status ?? 'all'}
          onValueChange={(value) =>
            onChange({
              status:
                value === 'all' ? undefined : (value as ContactSubmissionStatus),
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {contactSubmissionStatusValues.map((value) => (
              <SelectItem key={value} value={value}>
                {statusLabel[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={serviceInterest ?? 'all'}
          onValueChange={(value) =>
            onChange({
              serviceInterest:
                value === 'all'
                  ? undefined
                  : (value as (typeof contactServiceInterestValues)[number]),
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {contactServiceInterestValues.map((value) => (
              <SelectItem key={value} value={value}>
                {serviceInterestLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={urgency ?? 'all'}
          onValueChange={(value) =>
            onChange({
              urgency:
                value === 'all'
                  ? undefined
                  : (value as (typeof contactUrgencyValues)[number]),
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Urgency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All urgency levels</SelectItem>
            {contactUrgencyValues.map((value) => (
              <SelectItem key={value} value={value}>
                {urgencyLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={assignment ?? 'all'}
          onValueChange={(value) =>
            onChange({
              assignment:
                value === 'all' ? undefined : (value as ContactAssignmentFilter),
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Assignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignments</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(value) =>
            onChange({
              sort: value as ContactAdminSort,
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {contactAdminSortValues.map((value) => (
              <SelectItem key={value} value={value}>
                {value === 'created-desc'
                  ? 'Newest first'
                  : value === 'created-asc'
                    ? 'Oldest first'
                    : 'Recently updated'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
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

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Created from</p>
          <Input
            type="date"
            value={fromDateInput}
            onChange={(event) => setFromDateInput(event.target.value)}
            className="h-9 border-input bg-background"
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Created to</p>
          <Input
            type="date"
            value={toDateInput}
            onChange={(event) => setToDateInput(event.target.value)}
            className="h-9 border-input bg-background"
          />
        </div>

        <div className="self-end xl:justify-end">
          <Button
            type="button"
            variant={hasDateRange ? 'default' : 'outline'}
            className="w-full md:w-auto"
            onClick={() =>
              onChange({
                fromDate: fromDateInput
                  ? toStartDateISOString(fromDateInput)
                  : undefined,
                toDate: toDateInput ? toEndDateISOString(toDateInput) : undefined,
                page: 1,
              })
            }
          >
            Apply Date Range
          </Button>
        </div>
      </div>
    </div>
  )
}
