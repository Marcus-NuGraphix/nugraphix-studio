const messageIncludes = (value: string, needle: string) =>
  value.toLowerCase().includes(needle)

const safeMessageByPattern: Array<{
  pattern: RegExp
  message: string
}> = [
  {
    pattern: /too many .*attempts/i,
    message: 'Too many attempts. Please wait before retrying.',
  },
  {
    pattern: /you cannot remove your own admin role/i,
    message: 'You cannot remove your own admin role.',
  },
  {
    pattern: /you cannot suspend your own account/i,
    message: 'You cannot suspend your own account.',
  },
  {
    pattern: /cannot delete your own account/i,
    message: 'You cannot delete your own account.',
  },
  {
    pattern: /only failed email messages can be retried/i,
    message: 'Only failed email messages can be retried.',
  },
  {
    pattern: /user not found/i,
    message: 'The selected user could not be found.',
  },
]

export const toSafeActionErrorMessage = ({
  error,
  fallback,
  context,
}: {
  error: unknown
  fallback: string
  context?: string
}) => {
  if (context) {
    console.error(`[${context}]`, error)
  }

  if (!(error instanceof Error) || !error.message) {
    return fallback
  }

  const message = error.message.trim()

  if (
    messageIncludes(message, 'invalid current password') ||
    messageIncludes(message, 'invalid password') ||
    messageIncludes(message, 'incorrect password')
  ) {
    return 'Current password is incorrect.'
  }

  const matchedRule = safeMessageByPattern.find(({ pattern }) =>
    pattern.test(message),
  )

  return matchedRule?.message ?? fallback
}
