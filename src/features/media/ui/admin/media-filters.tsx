import { RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type {
  MediaAssetSortOption,
  MediaAssetType,
} from '@/features/media/model/types'
import {
  mediaAssetSortValues,
  mediaAssetTypeValues,
} from '@/features/media/model/types'
import { SearchInput } from '@/components/forms'
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
import { mediaTypeLabels } from '@/features/media/model/format'

interface MediaFiltersProps {
  query?: string
  type?: MediaAssetType
  sort: MediaAssetSortOption
  pageSize: number
  fromDate?: string
  toDate?: string
  onChange: (next: {
    query?: string
    type?: MediaAssetType
    sort?: MediaAssetSortOption
    pageSize?: number
    fromDate?: string
    toDate?: string
    page?: number
  }) => void
}

const sortLabels: Record<MediaAssetSortOption, string> = {
  'created-desc': 'Newest first',
  'created-asc': 'Oldest first',
  'name-asc': 'Name (A-Z)',
  'size-desc': 'Largest file first',
}

const toDateInputValue = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 10) : ''

const toStartDateISOString = (value: string) => `${value.trim()}T00:00:00.000Z`
const toEndDateISOString = (value: string) => `${value.trim()}T23:59:59.999Z`

export function MediaFilters({
  query,
  type,
  sort,
  pageSize,
  fromDate,
  toDate,
  onChange,
}: MediaFiltersProps) {
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

  const activeFilterCount = useMemo(
    () =>
      Number(Boolean(query)) +
      Number(Boolean(type)) +
      Number(Boolean(fromDate)) +
      Number(Boolean(toDate)) +
      Number(sort !== 'created-desc') +
      Number(pageSize !== 20),
    [fromDate, pageSize, query, sort, toDate, type],
  )

  return (
    <div className="space-y-4 rounded-xl border border-border bg-muted/40 p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Media Filters
          </p>
          <p className="text-sm text-muted-foreground">
            Narrow by type, date range, sort order, and keyword.
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
          placeholder="Search file name, mime type, or alt text"
          containerClassName="lg:max-w-md"
          aria-label="Search media assets"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              onChange({ query: queryInput.trim() || undefined, page: 1 })
            }
          }}
        />
        <Button
          onClick={() => onChange({ query: queryInput.trim() || undefined, page: 1 })}
        >
          Apply
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setQueryInput('')
            setFromDateInput('')
            setToDateInput('')
            onChange({
              query: undefined,
              type: undefined,
              sort: 'created-desc',
              pageSize: 20,
              fromDate: undefined,
              toDate: undefined,
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
          value={type ?? 'all'}
          onValueChange={(value) =>
            onChange({
              type: value === 'all' ? undefined : (value as MediaAssetType),
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Asset type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All asset types</SelectItem>
            {mediaAssetTypeValues.map((value) => (
              <SelectItem key={value} value={value}>
                {mediaTypeLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(value) =>
            onChange({ sort: value as MediaAssetSortOption, page: 1 })
          }
        >
          <SelectTrigger className="h-9 border-input bg-background">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {mediaAssetSortValues.map((value) => (
              <SelectItem key={value} value={value}>
                {sortLabels[value]}
              </SelectItem>
            ))}
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
            <SelectItem value="12">12 rows</SelectItem>
            <SelectItem value="20">20 rows</SelectItem>
            <SelectItem value="40">40 rows</SelectItem>
            <SelectItem value="80">80 rows</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            className="w-full md:w-auto"
            onClick={() =>
              onChange({
                query: queryInput.trim() || undefined,
                page: 1,
              })
            }
          >
            Refresh Listing
          </Button>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Created from</p>
          <Input
            type="date"
            className="h-9 border-input bg-background"
            value={fromDateInput}
            onChange={(event) => setFromDateInput(event.target.value)}
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Created to</p>
          <Input
            type="date"
            className="h-9 border-input bg-background"
            value={toDateInput}
            onChange={(event) => setToDateInput(event.target.value)}
          />
        </div>

        <div className="self-end xl:col-span-2 xl:justify-end">
          <Button
            type="button"
            variant={fromDateInput || toDateInput ? 'default' : 'outline'}
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
