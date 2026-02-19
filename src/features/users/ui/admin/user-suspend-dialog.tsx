import { ShieldOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface UserSuspendDialogProps {
  open: boolean
  userName?: string
  onOpenChange: (open: boolean) => void
  onSubmit: (reason: string) => Promise<void>
}

export function UserSuspendDialog({
  open,
  userName,
  onOpenChange,
  onSubmit,
}: UserSuspendDialogProps) {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setReason('')
      setIsSubmitting(false)
    }
  }, [open])

  const trimmedReason = reason.trim()
  const canSubmit = trimmedReason.length >= 3

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-border bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ShieldOff className="size-4 text-destructive" />
            Suspend User
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            {userName
              ? `Document the reason for suspending ${userName}.`
              : 'Document the reason for this account suspension.'}
          </DialogDescription>
        </DialogHeader>

        <form
          id="suspend-user-form"
          className="space-y-2"
          onSubmit={(event) => {
            event.preventDefault()
            if (!canSubmit) return
            setIsSubmitting(true)
            void onSubmit(trimmedReason).finally(() => setIsSubmitting(false))
          }}
        >
          <Label htmlFor="suspend-user-reason" className="text-foreground">
            Suspension Reason
          </Label>

          <Textarea
            id="suspend-user-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Access policy violation, account misuse, or operational hold details."
            className="min-h-28 border-input bg-background"
          />

          <p className="text-xs text-muted-foreground">
            This note is stored in audit history and visible to administrators.
          </p>
        </form>

        <DialogFooter className="border-t border-border bg-muted/30">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-background text-foreground hover:bg-muted"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="suspend-user-form"
            disabled={!canSubmit || isSubmitting}
            variant="destructive"
          >
            {isSubmitting ? 'Suspending...' : 'Suspend User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
