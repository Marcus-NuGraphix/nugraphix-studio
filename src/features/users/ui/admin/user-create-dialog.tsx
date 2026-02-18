import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { roleValues } from '@/features/auth/model/session'

type UserRole = 'user' | 'admin'

interface UserCreateDialogProps {
  onSubmit: (payload: {
    name: string
    email: string
    password: string
    role: UserRole
  }) => Promise<void>
}

const userCreateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  password: z.string().min(10),
  role: z.enum(roleValues),
})

export function UserCreateDialog({ onSubmit }: UserCreateDialogProps) {
  const [open, setOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user' as UserRole,
    },
    validators: {
      onChange: userCreateSchema,
      onSubmit: userCreateSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
      setOpen(false)
      form.reset({
        name: '',
        email: '',
        password: '',
        role: 'user',
      })
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          form.reset({
            name: '',
            email: '',
            password: '',
            role: 'user',
          })
        }
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
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder="Operations Team Member"
                        className="border-input bg-background"
                        autoComplete="name"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : null}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="role"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as UserRole)
                      }
                    >
                      <SelectTrigger
                        id={field.name}
                        className="border-input bg-background"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      Assign least privilege by default and elevate only when
                      required.
                    </FieldDescription>
                  </Field>
                )}
              />
            </div>

            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="user@nugraphix.co.za"
                      className="border-input bg-background"
                      autoComplete="email"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Temporary Password
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      className="border-input bg-background"
                      autoComplete="new-password"
                      aria-invalid={isInvalid}
                    />
                    <FieldDescription>
                      Minimum 10 characters. Share securely and enforce
                      rotation on first login.
                    </FieldDescription>
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>

        <DialogFooter className="border-border bg-muted/50">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                form="create-user-form"
                type="submit"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create User'}
              </Button>
            )}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
