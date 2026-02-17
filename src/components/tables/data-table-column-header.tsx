import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import type { Column } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: string
  className?: string
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div
        className={cn('text-foreground font-semibold tracking-wide', className)}
      >
        {title}
      </div>
    )
  }

  const sortDirection = column.getIsSorted()
  const sortIcon =
    sortDirection === 'desc' ? (
      <ArrowDownIcon className="size-3.5" />
    ) : sortDirection === 'asc' ? (
      <ArrowUpIcon className="size-3.5" />
    ) : (
      <ArrowUpDownIcon className="size-3.5 text-muted-foreground" />
    )

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        '-ml-2 h-8 px-2 text-xs font-semibold tracking-wide uppercase',
        sortDirection
          ? 'text-primary hover:text-primary/80'
          : 'text-foreground hover:text-foreground/80',
        className,
      )}
      onClick={() => column.toggleSorting(sortDirection === 'asc')}
    >
      <span>{title}</span>
      {sortIcon}
    </Button>
  )
}

export { DataTableColumnHeader }
