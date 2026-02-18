import { useForm } from '@tanstack/react-form'
import { useEffect } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { getInitials } from '@/lib/utils'

const profileFormSchema = z.object({
  name: z.string().trim().min(2).max(80),
  image: z
    .string()
    .trim()
    .max(500)
    .refine((value) => !value || z.url().safeParse(value).success, {
      message: 'Avatar must be a valid URL.',
    }),
})

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
  const form = useForm({
    defaultValues: {
      name: defaultName,
      image: defaultImage ?? '',
    },
    validators: {
      onChange: profileFormSchema,
      onSubmit: profileFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        name: value.name,
        image: value.image || undefined,
      })
    },
  })

  useEffect(() => {
    form.reset({
      name: defaultName,
      image: defaultImage ?? '',
    })
  }, [defaultImage, defaultName, form])

  const profileInitials = getInitials(defaultName, { fallback: 'NG' })

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <div className="border-border bg-muted/40 flex items-center gap-3 rounded-xl border p-3">
        <Avatar className="size-11">
          <AvatarImage src={defaultImage ?? undefined} alt={defaultName} />
          <AvatarFallback>{profileInitials}</AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">{defaultName}</p>
          <p className="text-xs text-muted-foreground">
            Update your display profile for platform communication and account
            identity.
          </p>
        </div>
      </div>

      <FieldGroup>
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Display Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  className="border-input bg-background"
                  autoComplete="name"
                  aria-invalid={isInvalid}
                  disabled={disabled}
                />
                <FieldDescription>
                  This name appears in your account area and email
                  communications.
                </FieldDescription>
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            )
          }}
        />

        <form.Field
          name="image"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Avatar URL</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="https://cdn.example.com/avatar.jpg"
                  className="border-input bg-background"
                  autoComplete="url"
                  aria-invalid={isInvalid}
                  disabled={disabled}
                />
                <FieldDescription>
                  Optional. Use a secure HTTPS image URL.
                </FieldDescription>
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            )
          }}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={disabled || !canSubmit || isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  )
}
