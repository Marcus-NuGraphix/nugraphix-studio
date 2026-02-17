import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type UserRole = 'user' | 'admin'

interface UserCreateDialogProps {
  onSubmit: (payload: {
    name: string
    email: string
    password: string
    role: UserRole
  }) => Promise<void>
}

export function UserCreateDialog({ onSubmit }: UserCreateDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('user')

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setRole('user')
  }

  const canSubmit =
    name.trim().length >= 2 &&
    email.trim().length > 0 &&
    password.trim().length >= 10

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="size-4" />
          Create User
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl border border-border bg-secondary text-secondary-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create User</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new account for operations, reporting, or administration.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-user-form"
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!canSubmit) return
            setIsSubmitting(true)
            void onSubmit({
              name: name.trim(),
              email: email.trim(),
              password: password.trim(),
              role,
            })
              .then(() => {
                setOpen(false)
                resetForm()
              })
              .finally(() => setIsSubmitting(false))
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="create-user-name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="create-user-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Community Team Member"
                className="border-input bg-background"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-user-role" className="text-foreground">
                Role
              </Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
              >
                <SelectTrigger
                  id="create-user-role"
                  className="border-input bg-background"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-user-email" className="text-foreground">
              Email Address
            </Label>
            <Input
              id="create-user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@nugraphix.co.za"
              className="border-input bg-background"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="create-user-password"
              className="text-foreground"
            >
              Temporary Password
            </Label>
            <Input
              id="create-user-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="border-input bg-background"
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters. Share securely and rotate on first login.
            </p>
          </div>
        </form>

        <DialogFooter className="border-border bg-muted/50">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            form="create-user-form"
            type="submit"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
