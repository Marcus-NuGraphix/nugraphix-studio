import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function ChangePasswordForm({
  onSubmit,
}: {
  onSubmit: (value: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
    revokeOtherSessions: boolean
  }) => Promise<void>
}) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        setIsSaving(true)
        void onSubmit({
          currentPassword,
          newPassword,
          confirmPassword,
          revokeOtherSessions,
        }).finally(() => setIsSaving(false))
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="current-password" className="text-foreground">
          Current Password
        </Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          autoComplete="current-password"
          className="border-input bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-password" className="text-foreground">
          New Password
        </Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          autoComplete="new-password"
          className="border-input bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-foreground">
          Confirm New Password
        </Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          className="border-input bg-background"
        />
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
        <Switch
          checked={revokeOtherSessions}
          onCheckedChange={setRevokeOtherSessions}
          id="revoke-other-sessions"
        />
        <Label htmlFor="revoke-other-sessions" className="text-foreground">
          Revoke my other sessions after password change
        </Label>
      </div>

      <p className="text-xs text-muted-foreground">
        Password must be at least 10 characters and should be unique to this
        account.
      </p>

      <Button
        type="submit"
        disabled={isSaving}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isSaving ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  )
}
