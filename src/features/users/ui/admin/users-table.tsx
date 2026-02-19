import {
  ArrowUpRight,
  MoreHorizontal,
  ShieldCheck,
  ShieldOff,
  ShieldX,
  Trash2,
  Users,
} from 'lucide-react'
import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { EmptyState } from '@/components/empties/empty-state'
import { DataTable, DataTableColumnHeader } from '@/components/tables'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getInitials } from '@/lib/utils'
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
          <div className="flex max-w-65 items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>
                {getInitials(row.original.name, { fallback: 'NG' })}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
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
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => (
          <Badge className="border-border bg-muted text-foreground">
            {row.original.role === 'admin' ? (
              <ShieldCheck className="size-3.5" />
            ) : (
              <ShieldOff className="size-3.5" />
            )}
            {row.original.role}
          </Badge>
        ),
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
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={`Open actions for ${entry.name}`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56"
                  onClick={(event) => event.stopPropagation()}
                >
                  <DropdownMenuItem onClick={() => onOpenDetail(entry.id)}>
                    Open profile
                    <ArrowUpRight className="ml-auto size-4" />
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={isSelf}
                    onClick={() =>
                      onRoleChange(entry.id, entry.role === 'admin' ? 'user' : 'admin')
                    }
                  >
                    {entry.role === 'admin' ? 'Set as user' : 'Set as admin'}
                  </DropdownMenuItem>

                  {entry.status === 'suspended' ? (
                    <DropdownMenuItem onClick={() => onReactivate(entry.id)}>
                      Reactivate account
                      <ShieldCheck className="ml-auto size-4" />
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      disabled={isSelf}
                      onClick={() => onSuspend(entry.id)}
                    >
                      Suspend account
                      <ShieldOff className="ml-auto size-4" />
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem onClick={() => onRevokeSessions(entry.id)}>
                    Revoke all sessions
                    <ShieldX className="ml-auto size-4" />
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={isSelf}
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(entry.id)}
                  >
                    Delete user
                    <Trash2 className="ml-auto size-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
