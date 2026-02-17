import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ProfileForm({
  defaultName,
  defaultImage,
  onSubmit,
  disabled,
}: {
  defaultName: string
  defaultImage?: string | null
  disabled?: boolean
  onSubmit: (value: { name: string; image?: string }) => Promise<void>
}) {
  const [name, setName] = useState(defaultName)
  const [image, setImage] = useState(defaultImage ?? '')
  const [isSaving, setIsSaving] = useState(false)

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        setIsSaving(true)
        void onSubmit({ name, image: image || undefined }).finally(() =>
          setIsSaving(false),
        )
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="account-name" className="text-foreground">
          Display Name
        </Label>
        <Input
          id="account-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="border-input bg-background"
          autoComplete="name"
          disabled={disabled || isSaving}
        />
        <p className="text-xs text-muted-foreground">
          This name appears in your account area and email communications.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="account-image" className="text-foreground">
          Avatar URL
        </Label>
        <Input
          id="account-image"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://..."
          className="border-input bg-background"
          autoComplete="url"
          disabled={disabled || isSaving}
        />
        <p className="text-xs text-muted-foreground">
          Optional. Use a secure HTTPS image URL.
        </p>
      </div>

      <Button
        type="submit"
        disabled={disabled || isSaving}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isSaving ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  )
}
