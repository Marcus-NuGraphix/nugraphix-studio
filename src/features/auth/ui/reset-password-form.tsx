import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { AlertTriangle, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { authClient } from '@/features/auth/client/auth-client'
import { toSafeAuthErrorMessage } from '@/features/auth/model/safe-errors'
import { resetPasswordSchema } from '@/features/auth/schemas/auth'
import {
  AUTH_INPUT_GROUP_CLASSNAME,
  AUTH_INPUT_GROUP_TOGGLE_CLASSNAME,
  AuthFormCard,
} from '@/features/auth/ui/auth-form-card'

interface ResetPasswordFormProps {
  token: string
  redirectTo?: string
}

export function ResetPasswordForm({
  token,
  redirectTo = '/',
}: ResetPasswordFormProps) {
  const navigate = useNavigate()
  const hasToken = token.trim().length > 0
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: resetPasswordSchema,
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      if (!hasToken) {
        setSubmitError(
          'This reset link is invalid or expired. Request a new one.',
        )
        return
      }

      await authClient.resetPassword({
        token,
        newPassword: value.password,
        fetchOptions: {
          onSuccess: () => {
            setIsComplete(true)
            toast.success('Password reset successfully.')
          },
          onError: ({ error }) => {
            const safeMessage = toSafeAuthErrorMessage({
              error,
              mode: 'reset-password',
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
      title="Create a new password"
      description="Choose a strong replacement password for your account."
      panelBadge="Secure Reset"
      panelTitle="Finish your account recovery"
      panelDescription="Set a strong new password to complete recovery and continue signing in safely."
      panelHighlights={[
        'Token validation protects against invalid reset attempts',
        'Password rules enforce strong account security',
        'Sign in immediately after successful reset',
      ]}
      footer={
        <>
          For any suspicious account activity, change your password immediately
          and review account security settings.
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
            <AlertTitle>Unable to reset password</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        ) : null}

        {!hasToken && !submitError ? (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Reset link required</AlertTitle>
            <AlertDescription>
              This reset link is invalid or expired. Request a new one.
            </AlertDescription>
          </Alert>
        ) : null}

        {isComplete ? (
          <Alert>
            <ShieldCheck className="size-4" />
            <AlertTitle>Password updated</AlertTitle>
            <AlertDescription>
              Your password has been reset. Continue to sign in with your new
              credentials.
            </AlertDescription>
          </Alert>
        ) : null}

        <FieldGroup>
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                  <InputGroup className={AUTH_INPUT_GROUP_CLASSNAME}>
                    <InputGroupInput
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter a new password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        size="icon-sm"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                        onClick={() => setShowPassword((value) => !value)}
                        className={AUTH_INPUT_GROUP_TOGGLE_CLASSNAME}
                      >
                        {showPassword ? (
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
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <InputGroup className={AUTH_INPUT_GROUP_CLASSNAME}>
                    <InputGroupInput
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Re-enter the new password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        size="icon-sm"
                        aria-label={
                          showConfirmPassword
                            ? 'Hide password confirmation'
                            : 'Show password confirmation'
                        }
                        onClick={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                        className={AUTH_INPUT_GROUP_TOGGLE_CLASSNAME}
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

          <FieldDescription>
            Passwords must be 10+ characters and include upper/lower case
            letters and a number.
          </FieldDescription>

          <Field>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  disabled={!hasToken || !canSubmit || isSubmitting || isComplete}
                  type="submit"
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              )}
            />
          </Field>

          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-background">
            Continue
          </FieldSeparator>

          <Field className="flex flex-col gap-2 sm:flex-row">
            <Button
              asChild
              variant="outline"
              className="w-full border-border sm:w-auto"
            >
              <Link to="/login" search={{ redirect: redirectTo }}>
                Back to Login
              </Link>
            </Button>

            {isComplete ? (
              <Button
                type="button"
                className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                onClick={() => {
                  void navigate({
                    to: '/login',
                    search: { redirect: redirectTo },
                  })
                }}
              >
                Sign In Now
              </Button>
            ) : null}
          </Field>
        </FieldGroup>
      </form>
    </AuthFormCard>
  )
}
