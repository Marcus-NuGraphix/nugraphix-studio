import { ArrowUpRight, Mail, RotateCcw } from 'lucide-react'
import { useMemo } from 'react'
import type { EmailMessageStatus } from '@/features/email/model/types'
import type { ColumnDef } from '@tanstack/react-table'
import { EmptyState } from '@/components/empties/empty-state'
import { DataTable, DataTableColumnHeader } from '@/components/tables'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

type CheckedState = boolean | 'indeterminate'

type EmailMessageRow = {
  id: string
  toEmail: string
  subject: string
  templateKey: string
  status: EmailMessageStatus
  topic:
    | 'blog'
    | 'press'
    | 'product'
    | 'security'
    | 'account'
    | 'contact'
    | null
  attempts: number
  createdAt: Date
  updatedAt: Date
  sentAt: Date | null
}

interface EmailMessagesTableProps {
  messages: Array<EmailMessageRow>
  selectedIds: Array<string>
  onToggleSelect: (id: string, checked: boolean) => void
  onToggleSelectAll: (checked: boolean) => void
  onOpenDetail: (id: string) => void
  onRetry: (id: string) => Promise<void>
}

const topicLabel: Record<Exclude<EmailMessageRow['topic'], null>, string> = {
  blog: 'news',
  press: 'press',
  product: 'product',
  security: 'security',
  account: 'account',
  contact: 'contact',
}

export function EmailMessagesTable({
  messages,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onOpenDetail,
  onRetry,
}: EmailMessagesTableProps) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const allSelected =
    messages.length > 0 && selectedIds.length === messages.length
  const selectAllState: CheckedState =
    selectedIds.length > 0 && !allSelected ? 'indeterminate' : allSelected

  const columns = useMemo<Array<ColumnDef<EmailMessageRow>>>(
    () => [
      {
        id: 'select',
        enableSorting: false,
        header: () => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={selectAllState}
              onCheckedChange={(checked) => onToggleSelectAll(Boolean(checked))}
              aria-label="Select all email messages on this page"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={selectedSet.has(row.original.id)}
              onCheckedChange={(checked) =>
                onToggleSelect(row.original.id, Boolean(checked))
              }
              aria-label={`Select message to ${row.original.toEmail}`}
            />
          </div>
        ),
      },
      {
        accessorKey: 'toEmail',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Recipient" />
        ),
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <p className="font-mono text-xs text-foreground">
              {row.original.toEmail}
            </p>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {row.original.subject}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'templateKey',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Template" />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.templateKey}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'topic',
        accessorFn: (row) => row.topic ?? '',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Topic" />
        ),
        cell: ({ row }) =>
          row.original.topic ? (
            <Badge
              variant="outline"
              className="border-border bg-card text-muted-foreground"
            >
              {topicLabel[row.original.topic]}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'attempts',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Attempts" />
        ),
      },
      {
        id: 'createdAt',
        accessorFn: (row) => row.createdAt.getTime(),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ row }) => (
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p>{row.original.createdAt.toLocaleString()}</p>
            {row.original.sentAt ? (
              <p>Sent: {row.original.sentAt.toLocaleString()}</p>
            ) : null}
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
          <div className="flex justify-end gap-1.5">
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
            {row.original.status === 'failed' ? (
              <Button
                size="sm"
                variant="outline"
                onClick={(event) => {
                  event.stopPropagation()
                  void onRetry(row.original.id)
                }}
              >
                <RotateCcw className="size-3.5" />
                Retry
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [
      onOpenDetail,
      onRetry,
      onToggleSelect,
      onToggleSelectAll,
      selectAllState,
      selectedSet,
    ],
  )

  return (
    <DataTable
      columns={columns}
      data={messages}
      enablePagination={false}
      onRowClick={(row) => onOpenDetail(row.id)}
      className="rounded-2xl border border-border bg-card p-3 shadow-sm"
      tableClassName="bg-card"
      emptyState={
        <EmptyState
          icon={Mail}
          title="No email messages found"
          description="Adjust filters or generate new message activity."
          className="border-border bg-secondary text-foreground"
        />
      }
    />
  )
}

function StatusBadge({ status }: { status: EmailMessageStatus }) {
  if (status === 'failed' || status === 'bounced' || status === 'complained') {
    return (
      <Badge className="border border-destructive/30 bg-destructive/10 text-destructive">
        {status}
      </Badge>
    )
  }

  if (status === 'delivered' || status === 'opened' || status === 'clicked') {
    return (
      <Badge className="border border-accent/30 bg-accent/10 text-accent">
        {status}
      </Badge>
    )
  }

  if (status === 'queued' || status === 'sent') {
    return (
      <Badge className="border border-border bg-secondary text-muted-foreground">
        {status}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="text-muted-foreground">
      {status}
    </Badge>
  )
}
