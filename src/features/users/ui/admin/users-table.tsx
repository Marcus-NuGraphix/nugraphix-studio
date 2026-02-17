import {
  ArrowUpRight,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Users,
} from 'lucide-react'
import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { EmptyState } from '@/components/empties/empty-state'
import { DataTable, DataTableColumnHeader } from '@/components/tables'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserStatusBadge } from '@/features/users/ui/admin/user-status-badge'

export interface UsersTableRow {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  status: 'active' | 'suspended' | 'invited'
  emailVerified: boolean
  createdAt: Date
}

type Props = {
  users: Array<UsersTableRow>
  currentUserId: string
  onOpenDetail: (id: string) => void
  onRoleChange: (id: string, role: 'user' | 'admin') => void
  onSuspend: (id: string) => void
  onReactivate: (id: string) => void
  onRevokeSessions: (id: string) => void
  onDelete: (id: string) => void
}

export function UsersTable({
  users,
  currentUserId,
  onOpenDetail,
  onRoleChange,
  onSuspend,
  onReactivate,
  onRevokeSessions,
  onDelete,
}: Props) {
  const columns = useMemo<Array<ColumnDef<UsersTableRow>>>(
    () => [
      {
        id: 'user',
        accessorFn: (row) => row.name,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="User" />
        ),
        cell: ({ row }) => (
          <div className="flex max-w-65 flex-col gap-0.5">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onOpenDetail(row.original.id)
              }}
              className="line-clamp-1 text-left font-semibold text-foreground hover:text-foreground/80 hover:underline"
            >
              {row.original.name}
            </button>
            <span className="line-clamp-1 text-xs text-muted-foreground">
              {row.original.email}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
          const entry = row.original
          const isSelf = entry.id === currentUserId

          return (
            <div onClick={(event) => event.stopPropagation()}>
              <Select
                value={entry.role}
                onValueChange={(value) =>
                  onRoleChange(entry.id, value as 'user' | 'admin')
                }
                disabled={isSelf}
              >
                <SelectTrigger className="h-8 w-28 border-input bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
      },
      {
        id: 'email',
        accessorFn: (row) => row.emailVerified,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => (
          <Badge
            className={
              row.original.emailVerified
                ? 'border border-primary/30 bg-primary/10 text-primary'
                : 'border border-border bg-background text-muted-foreground'
            }
          >
            {row.original.emailVerified ? 'Verified' : 'Unverified'}
          </Badge>
        ),
      },
      {
        id: 'joined',
        accessorFn: (row) => row.createdAt.getTime(),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Joined" />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.createdAt.toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'actions',
        enableSorting: false,
        header: () => (
          <div className="text-right text-xs font-semibold uppercase text-muted-foreground">
            Actions
          </div>
        ),
        cell: ({ row }) => {
          const entry = row.original
          const isSelf = entry.id === currentUserId

          return (
            <div className="flex flex-wrap justify-end gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="bg-background text-foreground hover:bg-muted"
                onClick={(event) => {
                  event.stopPropagation()
                  onOpenDetail(entry.id)
                }}
              >
                Inspect
                <ArrowUpRight className="size-3.5" />
              </Button>

              {entry.status === 'suspended' ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background text-foreground hover:bg-muted"
                  onClick={(event) => {
                    event.stopPropagation()
                    onReactivate(entry.id)
                  }}
                >
                  <ShieldCheck className="size-4" />
                  Reactivate
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background text-foreground hover:bg-muted"
                  onClick={(event) => {
                    event.stopPropagation()
                    onSuspend(entry.id)
                  }}
                  disabled={isSelf}
                >
                  <ShieldOff className="size-4" />
                  Suspend
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="bg-background text-foreground hover:bg-muted"
                onClick={(event) => {
                  event.stopPropagation()
                  onRevokeSessions(entry.id)
                }}
              >
                Revoke Sessions
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-destructive/40 bg-background text-destructive hover:bg-destructive/10"
                onClick={(event) => {
                  event.stopPropagation()
                  onDelete(entry.id)
                }}
                disabled={isSelf}
                aria-label={`Delete ${entry.name}`}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          )
        },
      },
    ],
    [
      currentUserId,
      onDelete,
      onOpenDetail,
      onReactivate,
      onRevokeSessions,
      onRoleChange,
      onSuspend,
    ],
  )

  return (
    <DataTable
      columns={columns}
      data={users}
      enablePagination={false}
      onRowClick={(row) => onOpenDetail(row.id)}
      className="rounded-2xl border border-border bg-card p-3 shadow-sm"
      tableClassName="bg-card [&_thead_tr]:border-border [&_tbody_tr]:border-border/60 [&_tbody_tr:hover]:bg-muted/40 [&_td]:align-top [&_th]:text-foreground"
      emptyState={
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try broadening filters or invite a new user account."
          className="border-border bg-card text-foreground"
        />
      }
    />
  )
}
