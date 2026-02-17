import { XIcon } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchColumnId?: string
  searchPlaceholder?: string
  children?: ReactNode
}

function DataTableToolbar<TData>({
  table,
  searchColumnId,
  searchPlaceholder = 'Search...',
  children,
}: DataTableToolbarProps<TData>) {
  const searchColumn = searchColumnId
    ? table.getColumn(searchColumnId)
    : undefined

  const searchValue = searchColumn?.getFilterValue()
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {searchColumn ? (
          <Input
            placeholder={searchPlaceholder}
            value={typeof searchValue === 'string' ? searchValue : ''}
            onChange={(event) =>
              searchColumn.setFilterValue(event.target.value)
            }
            className="h-9 w-full max-w-xs border-input bg-background"
          />
        ) : null}

        {isFiltered ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
          >
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
