import { useForm } from '@tanstack/react-form'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Switch } from '@/components/ui/switch'

const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(10).max(128),
    confirmPassword: z.string().min(10).max(128),
    revokeOtherSessions: z.boolean(),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      revokeOtherSessions: true,
    },
    validators: {
      onChange: changePasswordFormSchema,
      onSubmit: changePasswordFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
      form.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        revokeOtherSessions: value.revokeOtherSessions,
      })
    },
  })

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field
          name="currentPassword"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
                <InputGroup className="border-input bg-background">
                  <InputGroupInput
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    type={showCurrentPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    aria-invalid={isInvalid}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-sm"
                      aria-label={
                        showCurrentPassword
                          ? 'Hide current password'
                          : 'Show current password'
                      }
                      onClick={() => setShowCurrentPassword((value) => !value)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            )
          }}
        />

        <form.Field
          name="newPassword"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                <InputGroup className="border-input bg-background">
                  <InputGroupInput
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    type={showNewPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    aria-invalid={isInvalid}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-sm"
                      aria-label={
                        showNewPassword
                          ? 'Hide new password'
                          : 'Show new password'
                      }
                      onClick={() => setShowNewPassword((value) => !value)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            )
          }}
        />

        <form.Field
          name="confirmPassword"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Confirm New Password
                </FieldLabel>
                <InputGroup className="border-input bg-background">
                  <InputGroupInput
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    aria-invalid={isInvalid}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-sm"
                      aria-label={
                        showConfirmPassword
                          ? 'Hide password confirmation'
                          : 'Show password confirmation'
                      }
                      onClick={() => setShowConfirmPassword((value) => !value)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            )
          }}
        />

        <form.Field
          name="revokeOtherSessions"
          children={(field) => (
            <Field className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
              <Switch
                checked={field.state.value}
                onCheckedChange={field.handleChange}
                id={field.name}
              />
              <FieldLabel htmlFor={field.name}>
                Revoke my other sessions after password change
              </FieldLabel>
            </Field>
          )}
        />

        <FieldDescription>
          Password must be at least 10 characters and should be unique to this
          account.
        </FieldDescription>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  )
}
