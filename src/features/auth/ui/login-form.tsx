import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react'
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { authClient } from '@/features/auth/client/auth-client'
import { toSafeAuthErrorMessage } from '@/features/auth/model/safe-errors'
import { loginSchema } from '@/features/auth/schemas/auth'
import {
  AUTH_INPUT_CLASSNAME,
  AUTH_INPUT_GROUP_CLASSNAME,
  AUTH_INPUT_GROUP_TOGGLE_CLASSNAME,
  AuthFormCard,
} from '@/features/auth/ui/auth-form-card'

interface LoginFormProps {
  redirectTo?: string
}

export function LoginForm({ redirectTo = '/' }: LoginFormProps) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      await authClient.signIn.email({
        email: value.email,
        password: value.password,
        fetchOptions: {
          onSuccess: () => {
            void navigate({ to: redirectTo })
            toast.success('Logged in successfully.')
          },
          onError: ({ error }) => {
            const safeMessage = toSafeAuthErrorMessage({
              error,
              mode: 'login',
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
      title="Welcome back"
      description="Sign in to access your account details, service information, and support options."
      panelBadge="Client Portal"
      panelTitle="Secure access to Nu Graphix Studio"
      panelDescription="Use your account to stay connected with Nu Graphix delivery updates, account controls, and support workflows."
      panelHighlights={[
        'Protected sign-in and session controls',
        'Quick access to account and project updates',
        'Trusted account recovery options when needed',
      ]}
      footer={<>By continuing, you agree to our Terms and Privacy Policy.</>}
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
            <AlertTitle>Unable to sign in</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
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
                    autoCapitalize="none"
                    className={AUTH_INPUT_CLASSNAME}
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
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Link
                      to="/forgot-password"
                      search={{ redirect: redirectTo }}
                      className="text-sm text-foreground/80 underline-offset-2 hover:text-foreground hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <InputGroup className={AUTH_INPUT_GROUP_CLASSNAME}>
                    <InputGroupInput
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
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
                      Logging in...
                    </>
                  ) : (
                    'Log In'
                  )}
                </Button>
              )}
            />
          </Field>

          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-background">
            Need an account?
          </FieldSeparator>

          <Field>
            <FieldDescription className="text-center text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                search={{ redirect: redirectTo }}
                className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/90"
              >
                Create one
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </AuthFormCard>
  )
}
