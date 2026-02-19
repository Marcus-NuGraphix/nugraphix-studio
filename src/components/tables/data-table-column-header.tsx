import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  EyeOffIcon,
} from 'lucide-react'
import type { Column } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const sortIcon = (() => {
    if (sortDirection === 'desc') {
      return <ArrowDownIcon className="size-3.5" />
    }

    if (sortDirection === 'asc') {
      return <ArrowUpIcon className="size-3.5" />
    }

    return <ArrowUpDownIcon className="size-3.5 text-muted-foreground" />
  })()

  return (
    <div className={cn('flex items-center', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              '-ml-2 h-8 px-2 text-xs font-semibold tracking-wide uppercase',
              sortDirection
                ? 'text-primary hover:text-primary/80'
                : 'text-foreground hover:text-foreground/80',
            )}
          >
            <span>{title}</span>
            {sortIcon}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="size-4" />
            Sort ascending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="size-4" />
            Sort descending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.clearSorting()}>
            <ArrowUpDownIcon className="size-4" />
            Clear sorting
          </DropdownMenuItem>
          {column.getCanHide() ? (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOffIcon className="size-4" />
              Hide column
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { DataTableColumnHeader }
