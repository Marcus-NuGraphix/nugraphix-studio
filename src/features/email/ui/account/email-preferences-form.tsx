import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

type PreferenceState = {
  transactionalEnabled: boolean
  editorialEnabled: boolean
  blogUpdatesEnabled: boolean
  pressUpdatesEnabled: boolean
  productUpdatesEnabled: boolean
  securityAlertsEnabled: boolean
}

interface EmailPreferencesFormProps {
  initialValues: PreferenceState
  onSubmit: (values: PreferenceState) => Promise<void>
}

export function EmailPreferencesForm({
  initialValues,
  onSubmit,
}: EmailPreferencesFormProps) {
  const [values, setValues] = useState<PreferenceState>(initialValues)
  const [isSaving, setIsSaving] = useState(false)

  const setValue = <TPreferenceKey extends keyof PreferenceState>(
    key: TPreferenceKey,
    nextValue: PreferenceState[TPreferenceKey],
  ) => {
    setValues((current) => ({ ...current, [key]: nextValue }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PreferenceRow
          id="pref-transactional"
          title="Transactional emails"
          description="Account and security notifications required for operation."
          checked={values.transactionalEnabled}
          disabled
          onCheckedChange={(checked) =>
            setValue('transactionalEnabled', checked === true)
          }
        />

        <Separator />

        <PreferenceRow
          id="pref-editorial"
          title="Editorial updates"
          description="Newsroom updates for news, press, and product announcements."
          checked={values.editorialEnabled}
          onCheckedChange={(checked) =>
            setValue('editorialEnabled', checked === true)
          }
        />

        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-3">
          <PreferenceRow
            id="pref-blog"
            title="News"
            description="New newsroom stories"
            checked={values.blogUpdatesEnabled}
            disabled={!values.editorialEnabled}
            onCheckedChange={(checked) =>
              setValue('blogUpdatesEnabled', checked === true)
            }
          />
          <PreferenceRow
            id="pref-press"
            title="Press"
            description="New press releases"
            checked={values.pressUpdatesEnabled}
            disabled={!values.editorialEnabled}
            onCheckedChange={(checked) =>
              setValue('pressUpdatesEnabled', checked === true)
            }
          />
          <PreferenceRow
            id="pref-product"
            title="Product"
            description="Product announcements"
            checked={values.productUpdatesEnabled}
            disabled={!values.editorialEnabled}
            onCheckedChange={(checked) =>
              setValue('productUpdatesEnabled', checked === true)
            }
          />
        </div>

        <Separator />

        <PreferenceRow
          id="pref-security"
          title="Security alerts"
          description="Critical account security notices."
          checked={values.securityAlertsEnabled}
          onCheckedChange={(checked) =>
            setValue('securityAlertsEnabled', checked === true)
          }
        />

        <Button
          onClick={async () => {
            setIsSaving(true)
            try {
              await onSubmit(values)
            } finally {
              setIsSaving(false)
            }
          }}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  )
}

function PreferenceRow({
  id,
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  id: string
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean | 'indeterminate') => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <Label htmlFor={id}>{title}</Label>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  )
}
