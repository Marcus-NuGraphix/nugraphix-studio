import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
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
  sort: 'created-desc' | 'created-asc' | 'name-asc' | 'name-desc'
  onChange: (next: {
    query?: string
    role?: 'user' | 'admin'
    status?: 'active' | 'suspended' | 'invited'
    emailVerified?: boolean
    sort?: 'created-desc' | 'created-asc' | 'name-asc' | 'name-desc'
    page?: number
  }) => void
}

export function UserFilters({
  query,
  role,
  status,
  emailVerified,
  sort,
  onChange,
}: Props) {
  const [queryInput, setQueryInput] = useState(query ?? '')
  const activeFilterCount =
    Number(Boolean(query)) +
    Number(Boolean(role)) +
    Number(Boolean(status)) +
    Number(emailVerified !== undefined) +
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
        <Input
          value={queryInput}
          onChange={(event) => setQueryInput(event.target.value)}
          placeholder="Search by name or email"
          className="h-9 border-input bg-background lg:max-w-sm"
        />
        <Button
          onClick={() =>
            onChange({ query: queryInput.trim() || undefined, page: 1 })
          }
        >
          Apply Search
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
              sort: 'created-desc',
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
      </div>
    </div>
  )
}
