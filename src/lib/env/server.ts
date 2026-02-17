import { z } from 'zod'
import { brandConfig } from '@/components/brand/brand.config'

const toOptionalTrimmedString = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const optionalUrl = z.preprocess(
  (value) => toOptionalTrimmedString(value),
  z.string().url().optional(),
)

const optionalEmail = z.preprocess(
  (value) => toOptionalTrimmedString(value),
  z.string().email().optional(),
)

const optionalCsv = z.preprocess(
  (value) => toOptionalTrimmedString(value),
  z
    .string()
    .transform((value) =>
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    )
    .optional(),
)

const optionalZeroToOneNumber = z.preprocess(
  (value) => toOptionalTrimmedString(value),
  z.coerce.number().finite().min(0).max(1).optional(),
)

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .optional()
    .default('development'),
  DATABASE_URL: z.string().trim().min(1),
  BETTER_AUTH_SECRET: z.string().trim().min(1),
  BETTER_AUTH_URL: z.string().trim().url(),
  BETTER_AUTH_BASE_URL: z.string().trim().url(),
  BETTER_AUTH_TRUSTED_ORIGINS: optionalCsv,
  S3_REGION: z.string().trim().min(1),
  S3_BUCKET: z.string().trim().min(1),
  S3_ACCESS_KEY_ID: z.string().trim().min(1),
  S3_SECRET_ACCESS_KEY: z.string().trim().min(1),
  S3_ENDPOINT: optionalUrl,
  S3_PUBLIC_BASE_URL: optionalUrl,
  S3_FORCE_PATH_STYLE: z
    .preprocess((value) => toOptionalTrimmedString(value), z.stringbool())
    .optional()
    .default(false),
  EMAIL_PROVIDER: z.enum(['noop', 'resend']).optional().default('noop'),
  EMAIL_FROM_ADDRESS: z
    .string()
    .trim()
    .min(1)
    .optional()
    .default(brandConfig.email.fromAddressDefault),
  EMAIL_REPLY_TO: optionalEmail,
  CONTACT_NOTIFICATION_EMAIL: z
    .string()
    .email()
    .optional()
    .default(brandConfig.contactEmail),
  VITE_RECAPTCHA_SITE_KEY: z.string().trim().min(1).optional(),
  RECAPTCHA_SECRET_KEY: z.string().trim().min(1).optional(),
  RECAPTCHA_MIN_SCORE: optionalZeroToOneNumber.default(0.5),
  PUBLIC_APP_URL: optionalUrl,
  RESEND_API_KEY: z.string().trim().min(1).optional(),
  RESEND_WEBHOOK_SECRET: z.string().trim().min(1).optional(),
  BACKGROUND_TASKS_DRAIN_SECRET: z.string().trim().min(1).optional(),
  CRON_SECRET: z.string().trim().min(1).optional(),
}).superRefine((value, context) => {
  if (value.EMAIL_PROVIDER === 'resend' && !value.RESEND_API_KEY) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['RESEND_API_KEY'],
      message: 'RESEND_API_KEY is required when EMAIL_PROVIDER is "resend".',
    })
  }

  const hasRecaptchaSiteKey = Boolean(value.VITE_RECAPTCHA_SITE_KEY)
  const hasRecaptchaSecret = Boolean(value.RECAPTCHA_SECRET_KEY)

  if (hasRecaptchaSiteKey !== hasRecaptchaSecret) {
    if (!hasRecaptchaSiteKey) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['VITE_RECAPTCHA_SITE_KEY'],
        message:
          'VITE_RECAPTCHA_SITE_KEY is required when RECAPTCHA_SECRET_KEY is set.',
      })
    }

    if (!hasRecaptchaSecret) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['RECAPTCHA_SECRET_KEY'],
        message:
          'RECAPTCHA_SECRET_KEY is required when VITE_RECAPTCHA_SITE_KEY is set.',
      })
    }
  }

  if (
    value.NODE_ENV === 'production' &&
    !value.CRON_SECRET &&
    !value.BACKGROUND_TASKS_DRAIN_SECRET
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['BACKGROUND_TASKS_DRAIN_SECRET'],
      message:
        'Set BACKGROUND_TASKS_DRAIN_SECRET or CRON_SECRET in production to authorize task drain endpoints.',
    })
  }
})

type ServerEnv = z.infer<typeof serverEnvSchema>

let cachedEnv: ServerEnv | undefined

const formatIssuePath = (path: Array<PropertyKey>) => {
  if (path.length === 0) {
    return '(root)'
  }

  return path
    .map((segment) => {
      if (typeof segment === 'number') {
        return `[${segment}]`
      }

      if (typeof segment === 'symbol') {
        return segment.toString()
      }

      return segment
    })
    .join('.')
    .replace('.[', '[')
}

const formatServerEnvError = (error: z.ZodError) => {
  const header = 'Invalid server environment configuration.'
  const pretty =
    typeof z.prettifyError === 'function' ? z.prettifyError(error) : ''

  if (pretty.trim().length > 0) {
    return `${header}\n${pretty}`
  }

  const details = error.issues.map((issue) => {
    return `- ${formatIssuePath(issue.path)}: ${issue.message}`
  })

  return [header, ...details].join('\n')
}

export const parseServerEnv = (
  source: Record<string, unknown> = process.env,
): ServerEnv => {
  const parsed = serverEnvSchema.safeParse(source)
  if (parsed.success) return parsed.data

  throw new Error(formatServerEnvError(parsed.error))
}

export const resetServerEnvCacheForTests = () => {
  cachedEnv = undefined
}

export const getServerEnv = (): ServerEnv => {
  cachedEnv ??= parseServerEnv(process.env)
  return cachedEnv
}

export const env = new Proxy({} as ServerEnv, {
  get(_target, property) {
    if (typeof property !== 'string') {
      return undefined
    }

    const values = getServerEnv()
    return values[property as keyof ServerEnv]
  },
})
