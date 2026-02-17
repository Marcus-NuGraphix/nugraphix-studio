import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'
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
import { signupSchema } from '@/features/auth/schemas/auth'
import {
  AUTH_INPUT_CLASSNAME,
  AUTH_INPUT_GROUP_CLASSNAME,
  AUTH_INPUT_GROUP_TOGGLE_CLASSNAME,
  AuthFormCard,
} from '@/features/auth/ui/auth-form-card'

const signupFormSchema = signupSchema
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

interface SignupFormProps {
  redirectTo?: string
}

export function SignupForm({ redirectTo = '/' }: SignupFormProps) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: signupFormSchema,
      onSubmit: signupFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      await authClient.signUp.email({
        name: value.fullName,
        email: value.email,
        password: value.password,
        fetchOptions: {
          onSuccess: () => {
            void navigate({ to: redirectTo })
            toast.success('Account created successfully.')
          },
          onError: ({ error }) => {
            const safeMessage = toSafeAuthErrorMessage({
              error,
              mode: 'signup',
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
      title="Create your account"
      description="Set up your CMS account to manage your details, communication preferences, and service updates."
      panelBadge="New Account"
      panelTitle="Get started with secure client access"
      panelDescription="Creating an account gives you a reliable way to stay informed and connected with our team."
      panelHighlights={[
        'Secure signup with password policy protection',
        'Manage your account and communication preferences',
        'Receive important service and security updates',
      ]}
      footer={
        <>By creating an account, you agree to our Terms and Privacy Policy.</>
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
            <AlertTitle>Unable to create account</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        ) : null}

        <FieldGroup>
          <form.Field
            name="fullName"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Jane Doe"
                    autoComplete="name"
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
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
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

          <Field className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <InputGroup className={AUTH_INPUT_GROUP_CLASSNAME}>
                      <InputGroupInput
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Create password"
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
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
                    <InputGroup className={AUTH_INPUT_GROUP_CLASSNAME}>
                      <InputGroupInput
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Repeat password"
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
          </Field>

          <FieldDescription>
            Passwords must be 10+ characters and include upper/lower case
            letters and a number.
          </FieldDescription>

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
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              )}
            />
          </Field>

          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-background">
            Already have an account?
          </FieldSeparator>

          <Field>
            <FieldDescription className="text-center text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                search={{ redirect: redirectTo }}
                className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/90"
              >
                Sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </AuthFormCard>
  )
}
