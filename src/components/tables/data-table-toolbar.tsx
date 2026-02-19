import { SlidersHorizontal, XIcon } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import { SearchInput } from '@/components/forms/search-input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchColumnId?: string
  searchPlaceholder?: string
  className?: string
  children?: ReactNode
}

function DataTableToolbar<TData>({
  table,
  searchColumnId,
  searchPlaceholder = 'Search...',
  className,
  children,
}: DataTableToolbarProps<TData>) {
  const searchColumn = searchColumnId
    ? table.getColumn(searchColumnId)
    : undefined

  const searchValue = searchColumn?.getFilterValue()
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div
      className={cn(
        'flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {searchColumn ? (
          <SearchInput
            value={typeof searchValue === 'string' ? searchValue : ''}
            onValueChange={(value) => searchColumn.setFilterValue(value)}
            onClear={() => searchColumn.setFilterValue('')}
            placeholder={searchPlaceholder}
            containerClassName="max-w-xs"
          />
        ) : null}

        {isFiltered ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground sm:text-sm"
          >
            <SlidersHorizontal className="size-3.5" />
            Reset
            <XIcon className="ml-1 size-3.5" />
          </Button>
        ) : null}
      </div>

      {children ? (
        <div className="flex items-center gap-2">{children}</div>
      ) : null}
    </div>
  )
}

export { DataTableToolbar }
