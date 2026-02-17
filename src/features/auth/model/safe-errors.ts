const GENERIC_LOGIN_ERROR =
  'Unable to sign in. Check your credentials and try again.'

const GENERIC_SIGNUP_ERROR =
  'Unable to create your account right now. Please try again.'

const GENERIC_FORGOT_PASSWORD_ERROR =
  'Unable to send reset instructions right now. Please try again.'

const GENERIC_RESET_PASSWORD_ERROR =
  'Unable to reset your password. Request a new reset link and try again.'

const GENERIC_RATE_LIMITED_ERROR =
  'Too many attempts. Please wait before retrying.'

const messageIncludes = (value: string, needle: string) =>
  value.toLowerCase().includes(needle)

const toErrorDetails = (error: unknown) => {
  if (error instanceof Error) {
    return {
      message: error.message.trim(),
      code: undefined as string | undefined,
    }
  }

  if (error && typeof error === 'object') {
    const payload = error as {
      code?: unknown
      message?: unknown
      error?: {
        code?: unknown
        message?: unknown
      }
    }

    const embedded = payload.error ?? payload

    return {
      message:
        typeof embedded.message === 'string' ? embedded.message.trim() : '',
      code: typeof embedded.code === 'string' ? embedded.code : undefined,
    }
  }

  return { message: '', code: undefined as string | undefined }
}

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

  const details = toErrorDetails(error)
  if (!details.message && !details.code) {
    return fallback
  }

  const message = details.message
  const code = details.code

  if (code === 'RATE_LIMITED' || messageIncludes(message, 'too many')) {
    return GENERIC_RATE_LIMITED_ERROR
  }

  if (mode === 'login') {
    if (
      code === 'UNAUTHORIZED' ||
      messageIncludes(message, 'invalid email') ||
      messageIncludes(message, 'invalid password') ||
      messageIncludes(message, 'invalid credentials')
    ) {
      return 'Invalid email or password.'
    }
  }

  if (mode === 'signup') {
    if (
      code === 'CONFLICT' ||
      messageIncludes(message, 'already exists') ||
      messageIncludes(message, 'already registered') ||
      messageIncludes(message, 'already in use')
    ) {
      return 'An account with this email already exists.'
    }
  }

  if (mode === 'reset-password') {
    if (
      code === 'NOT_FOUND' ||
      messageIncludes(message, 'invalid token') ||
      messageIncludes(message, 'token expired') ||
      messageIncludes(message, 'bad request')
    ) {
      return 'This reset link is invalid or expired. Request a new one.'
    }
  }

  return fallback
}
