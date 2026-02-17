const GENERIC_LOGIN_ERROR =
  'Unable to sign in. Check your credentials and try again.'

const GENERIC_SIGNUP_ERROR =
  'Unable to create your account right now. Please try again.'

const GENERIC_FORGOT_PASSWORD_ERROR =
  'Unable to send reset instructions right now. Please try again.'

const GENERIC_RESET_PASSWORD_ERROR =
  'Unable to reset your password. Request a new reset link and try again.'

const messageIncludes = (value: string, needle: string) =>
  value.toLowerCase().includes(needle)

export const toSafeAuthErrorMessage = ({
  error,
  mode,
}: {
  error: unknown
  mode: 'login' | 'signup' | 'forgot-password' | 'reset-password'
}) => {
  const fallback =
    mode === 'login'
      ? GENERIC_LOGIN_ERROR
      : mode === 'signup'
        ? GENERIC_SIGNUP_ERROR
        : mode === 'forgot-password'
          ? GENERIC_FORGOT_PASSWORD_ERROR
          : GENERIC_RESET_PASSWORD_ERROR

  if (!(error instanceof Error) || !error.message) {
    return fallback
  }

  const message = error.message.trim()

  if (mode === 'login') {
    if (
      messageIncludes(message, 'invalid email') ||
      messageIncludes(message, 'invalid password') ||
      messageIncludes(message, 'invalid credentials')
    ) {
      return 'Invalid email or password.'
    }
  }

  if (mode === 'signup') {
    if (
      messageIncludes(message, 'already exists') ||
      messageIncludes(message, 'already registered') ||
      messageIncludes(message, 'already in use')
    ) {
      return 'An account with this email already exists.'
    }
  }

  if (mode === 'reset-password') {
    if (
      messageIncludes(message, 'invalid token') ||
      messageIncludes(message, 'token expired') ||
      messageIncludes(message, 'bad request')
    ) {
      return 'This reset link is invalid or expired. Request a new one.'
    }
  }

  return fallback
}
