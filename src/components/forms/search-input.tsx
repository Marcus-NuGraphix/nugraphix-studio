import { Loader2, Search, X } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface SearchInputProps
  extends Omit<
    ComponentProps<typeof InputGroupInput>,
    'onChange' | 'type' | 'value'
  > {
  value: string
  onValueChange: (value: string) => void
  isLoading?: boolean
  onClear?: () => void
  shortcutHint?: string
  containerClassName?: string
}

export function SearchInput({
  value,
  onValueChange,
  isLoading = false,
  onClear,
  shortcutHint = '/',
  placeholder = 'Search...',
  containerClassName,
  ...props
}: SearchInputProps) {
  const isMobile = useIsMobile()
  const canClear = value.trim().length > 0

  return (
    <InputGroup className={cn('w-full', containerClassName)}>
      <InputGroupAddon align="inline-start">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Search"
          tabIndex={-1}
          className="pointer-events-none"
        >
          <Search className="size-4 text-muted-foreground" />
        </Button>
      </InputGroupAddon>

      <InputGroupInput
        {...props}
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        aria-label={props['aria-label'] ?? 'Search'}
      />

      <InputGroupAddon align="inline-end">
        {isLoading ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Searching"
            tabIndex={-1}
            className="pointer-events-none"
          >
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </Button>
        ) : canClear ? (
          <InputGroupButton
            size="icon-sm"
            aria-label="Clear search"
            onClick={() => {
              onValueChange('')
              onClear?.()
            }}
          >
            <X className="size-4" />
          </InputGroupButton>
        ) : !isMobile && shortcutHint ? (
          <Kbd>{shortcutHint}</Kbd>
        ) : null}
      </InputGroupAddon>
    </InputGroup>
  )
}
