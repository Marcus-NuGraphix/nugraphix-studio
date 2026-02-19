import { RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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

type Props = {
  query?: string
  role?: 'user' | 'admin'
  status?: 'active' | 'suspended' | 'invited'
  emailVerified?: boolean
  fromDate?: string
  toDate?: string
  pageSize: number
  sort: 'created-desc' | 'created-asc' | 'name-asc' | 'name-desc'
  onChange: (next: {
    query?: string
    role?: 'user' | 'admin'
    status?: 'active' | 'suspended' | 'invited'
    emailVerified?: boolean
    fromDate?: string
    toDate?: string
    sort?: 'created-desc' | 'created-asc' | 'name-asc' | 'name-desc'
    pageSize?: number
    page?: number
  }) => void
}

const toDateInputValue = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 10) : ''

const toStartDateISOString = (value: string) =>
  `${value.trim()}T00:00:00.000Z`

const toEndDateISOString = (value: string) =>
  `${value.trim()}T23:59:59.999Z`

export function UserFilters({
  query,
  role,
  status,
  emailVerified,
  fromDate,
  toDate,
  pageSize,
  sort,
  onChange,
}: Props) {
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
    Number(Boolean(role)) +
    Number(Boolean(status)) +
    Number(emailVerified !== undefined) +
    Number(Boolean(fromDate)) +
    Number(Boolean(toDate)) +
    Number(pageSize !== 20) +
    Number(sort !== 'created-desc')

  return (
    <div className="space-y-4 rounded-xl border border-border bg-muted/50 p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            User Directory Filters
          </p>
          <p className="text-sm text-muted-foreground">
            Refine by role, account state, verification status, and sort order.
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
          placeholder="Search by name or email"
          containerClassName="lg:max-w-md"
          aria-label="Search users"
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
              role: undefined,
              status: undefined,
              emailVerified: undefined,
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
          value={role ?? 'all'}
          onValueChange={(value) =>
            onChange({
              role: value === 'all' ? undefined : (value as Props['role']),
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={status ?? 'all'}
          onValueChange={(value) =>
            onChange({
              status: value === 'all' ? undefined : (value as Props['status']),
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            emailVerified === undefined ? 'all' : emailVerified ? 'yes' : 'no'
          }
          onValueChange={(value) =>
            onChange({
              emailVerified:
                value === 'all' ? undefined : value === 'yes' ? true : false,
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Email verified" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All verification states</SelectItem>
            <SelectItem value="yes">Verified</SelectItem>
            <SelectItem value="no">Unverified</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(value) =>
            onChange({
              sort: value as Props['sort'],
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created-desc">Newest first</SelectItem>
            <SelectItem value="created-asc">Oldest first</SelectItem>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
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
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
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
        <div className="md:col-span-2 xl:col-span-2 xl:justify-end">
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
