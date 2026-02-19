import { ArrowUpRight, Inbox } from 'lucide-react'
import { useMemo } from 'react'
import type { ContactSubmissionSummary } from '@/features/contact/model/types'
import type { ColumnDef } from '@tanstack/react-table'
import { EmptyState } from '@/components/empties/empty-state'
import { DataTable, DataTableColumnHeader } from '@/components/tables'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  serviceInterestLabels,
  urgencyLabels,
} from '@/features/contact/model/lead-form'
import { ContactStatusBadge } from '@/features/contact/ui/admin/contact-status-badge'

interface ContactsTableProps {
  contacts: Array<ContactSubmissionSummary>
  onOpenDetail: (id: string) => void
}

export function ContactsTable({ contacts, onOpenDetail }: ContactsTableProps) {
  const columns = useMemo<Array<ColumnDef<ContactSubmissionSummary>>>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Lead" />
        ),
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              {row.original.name}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        ),
      },
      {
        id: 'serviceInterest',
        accessorFn: (row) => row.serviceInterest,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Service Track" />
        ),
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="border-border bg-card text-muted-foreground"
          >
            {serviceInterestLabels[row.original.serviceInterest]}
          </Badge>
        ),
      },
      {
        id: 'urgency',
        accessorFn: (row) => row.urgency,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Urgency" />
        ),
        cell: ({ row }) => (
          <span className="text-xs font-medium text-muted-foreground">
            {urgencyLabels[row.original.urgency]}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => <ContactStatusBadge status={row.original.status} />,
      },
      {
        id: 'assignedTo',
        accessorFn: (row) => row.assignedTo?.name ?? '',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Assigned To" />
        ),
        cell: ({ row }) =>
          row.original.assignedTo ? (
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-foreground">
                {row.original.assignedTo.name}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {row.original.assignedTo.email}
              </p>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Unassigned</span>
          ),
      },
      {
        id: 'createdAt',
        accessorFn: (row) => new Date(row.createdAt).getTime(),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Submitted" />
        ),
        cell: ({ row }) => (
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p>{new Date(row.original.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(row.original.updatedAt).toLocaleString()}</p>
          </div>
        ),
      },
      {
        id: 'actions',
        enableSorting: false,
        header: () => (
          <div className="text-right text-xs font-semibold uppercase">
            Actions
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={(event) => {
                event.stopPropagation()
                onOpenDetail(row.original.id)
              }}
            >
              Inspect
              <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [onOpenDetail],
  )

  return (
    <DataTable
      columns={columns}
      data={contacts}
      enablePagination={false}
      onRowClick={(row) => onOpenDetail(row.id)}
      className="rounded-2xl border border-border bg-card p-3 shadow-sm"
      tableClassName="bg-card"
      emptyState={
        <EmptyState
          icon={Inbox}
          title="No contact submissions found"
          description="Adjust filters or wait for new inquiry activity."
          className="border-border bg-secondary text-foreground"
        />
      }
    />
  )
}
