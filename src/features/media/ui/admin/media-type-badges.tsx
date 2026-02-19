import type { MediaAssetType } from '@/features/media/model/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mediaTypeLabels } from '@/features/media/model/format'

interface MediaTypeBadgesProps {
  activeType?: MediaAssetType
  totals: Record<MediaAssetType, number>
  onTypeChange: (type?: MediaAssetType) => void
}

const typeOptions: Array<{ type?: MediaAssetType; label: string }> = [
  { label: 'All media' },
  { type: 'image', label: mediaTypeLabels.image },
  { type: 'document', label: mediaTypeLabels.document },
  { type: 'video', label: mediaTypeLabels.video },
  { type: 'audio', label: mediaTypeLabels.audio },
  { type: 'other', label: mediaTypeLabels.other },
]

const getTotalForType = (
  totals: Record<MediaAssetType, number>,
  type?: MediaAssetType,
) => {
  if (!type) {
    return Object.values(totals).reduce((sum, value) => sum + value, 0)
  }

  return totals[type]
}

export function MediaTypeBadges({
  activeType,
  totals,
  onTypeChange,
}: MediaTypeBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {typeOptions.map((option) => {
        const isActive =
          option.type === activeType || (option.type === undefined && !activeType)

        return (
          <Button
            key={option.label}
            type="button"
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            aria-pressed={isActive}
            onClick={() => onTypeChange(option.type)}
            className="gap-2"
          >
            <span>{option.label}</span>
            <Badge
              variant={isActive ? 'secondary' : 'outline'}
              className="text-xs"
            >
              {getTotalForType(totals, option.type)}
            </Badge>
          </Button>
        )
      })}
    </div>
  )
}
