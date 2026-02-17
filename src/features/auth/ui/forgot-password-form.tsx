import { useForm } from '@tanstack/react-form'
import { Link } from '@tanstack/react-router'
import { AlertTriangle, Loader2, MailCheck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/features/auth/client/auth-client'
import { toSafeAuthErrorMessage } from '@/features/auth/model/safe-errors'
import { forgotPasswordSchema } from '@/features/auth/schemas/auth'
import {
  AUTH_INPUT_CLASSNAME,
  AuthFormCard,
} from '@/features/auth/ui/auth-form-card'

interface ForgotPasswordFormProps {
  redirectTo?: string
}

const PASSWORD_RESET_NOTICE =
  'If the email exists in our system, you will receive a reset link shortly.'

export function ForgotPasswordForm({
  redirectTo = '/',
}: ForgotPasswordFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [didRequestReset, setDidRequestReset] = useState(false)

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: forgotPasswordSchema,
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      await authClient.requestPasswordReset({
        email: value.email,
        redirectTo,
        fetchOptions: {
          onSuccess: () => {
            setDidRequestReset(true)
            toast.success(PASSWORD_RESET_NOTICE)
          },
          onError: ({ error }) => {
            const safeMessage = toSafeAuthErrorMessage({
              error,
              mode: 'forgot-password',
            })
            setSubmitError(safeMessage)
            toast.error(safeMessage)
          },
        },
      })
    },
  })

  return (
    <AuthFormCard
      title="Forgot your password?"
      description="Enter your email and we will send a secure password reset link."
      panelBadge="Account Recovery"
      panelTitle="Recover access with confidence"
      panelDescription="We use secure, time-limited reset links so you can safely regain access to your account."
      panelHighlights={[
        'Secure reset links delivered to your inbox',
        'Privacy-first responses to protect account details',
        'Fast path back to secure account access',
      ]}
      footer={
        <>
          If you no longer have access to your inbox, contact our support team.
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        {submitError ? (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Unable to send reset link</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        ) : null}

        {didRequestReset ? (
          <Alert>
            <MailCheck className="size-4" />
            <AlertTitle>Request received</AlertTitle>
            <AlertDescription>{PASSWORD_RESET_NOTICE}</AlertDescription>
          </Alert>
        ) : null}

        <FieldGroup>
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="name@example.com"
                    type="email"
                    autoComplete="email"
                    className={AUTH_INPUT_CLASSNAME}
                  />
                  <FieldDescription>
                    Use the email address linked to your account.
                  </FieldDescription>
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )
            }}
          />

          <Field>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  disabled={!canSubmit || isSubmitting}
                  type="submit"
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              )}
            />
          </Field>

          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-background">
            Remembered your password?
          </FieldSeparator>

          <Field>
            <FieldDescription className="text-center text-muted-foreground">
              Return to{' '}
              <Link
                to="/login"
                search={{ redirect: redirectTo }}
                className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/90"
              >
                login
              </Link>
              .
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </AuthFormCard>
  )
}
