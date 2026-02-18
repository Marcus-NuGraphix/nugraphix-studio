import { X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn, generateSlug } from '@/lib/utils'

interface TagPickerProps {
  value: Array<string>
  onChange: (nextValue: Array<string>) => void
  placeholder?: string
  maxTags?: number
  normalizeWithSlug?: boolean
  disabled?: boolean
  className?: string
}

export function TagPicker({
  value,
  onChange,
  placeholder = 'Add tag and press Enter',
  maxTags = 12,
  normalizeWithSlug = true,
  disabled = false,
  className,
}: TagPickerProps) {
  const [draft, setDraft] = useState('')
  const isMobile = useIsMobile()

  const commitDraft = () => {
    const rawValue = draft.trim()
    if (!rawValue || disabled) {
      return
    }

    const normalized = normalizeWithSlug
      ? generateSlug(rawValue, { fallback: '', maxLength: 40 })
      : rawValue.toLowerCase()

    if (!normalized) {
      setDraft('')
      return
    }

    if (value.includes(normalized) || value.length >= maxTags) {
      setDraft('')
      return
    }

    onChange([...value, normalized])
    setDraft('')
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((currentTag) => currentTag !== tag))
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'bg-background border-input focus-within:ring-ring min-h-10 rounded-md border p-2 focus-within:ring-1',
          disabled && 'cursor-not-allowed opacity-70',
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="inline-flex items-center gap-1 pr-1"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag} tag`}
                disabled={disabled}
                className="hover:bg-muted inline-flex size-4 items-center justify-center rounded-sm"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}

          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault()
                commitDraft()
                return
              }

              if (
                event.key === 'Backspace' &&
                draft.length === 0 &&
                value.length > 0
              ) {
                event.preventDefault()
                removeTag(value[value.length - 1])
              }
            }}
            onBlur={commitDraft}
            placeholder={placeholder}
            disabled={disabled || value.length >= maxTags}
            className="h-7 min-w-36 border-none bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
            aria-label="Tag input"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {value.length}/{maxTags} tags
        {!isMobile && ' · Press Enter or comma to add a tag'}
      </p>
    </div>
  )
}
