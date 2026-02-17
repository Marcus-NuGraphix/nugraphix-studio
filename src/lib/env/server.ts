import { z } from 'zod'
import { brandConfig } from '@/components/brand/brand.config'

const optionalUrl = z.preprocess(
  (value) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  z.string().url().optional(),
)

const optionalCsv = z.preprocess(
  (value) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
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

const optionalNumber = z.preprocess(
  (value) =>
    typeof value === 'string' && value.trim() !== ''
      ? Number(value.trim())
      : undefined,
  z.number().finite().optional(),
)

const serverEnvSchema = z.object({
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
    .enum(['true', 'false'])
    .optional()
    .transform((value) => value === 'true'),
  EMAIL_PROVIDER: z.enum(['noop', 'resend']).optional().default('noop'),
  EMAIL_FROM_ADDRESS: z
    .string()
    .trim()
    .min(1)
    .optional()
    .default(brandConfig.email.fromAddressDefault),
  EMAIL_REPLY_TO: z.email().optional(),
  CONTACT_NOTIFICATION_EMAIL: z
    .email()
    .optional()
    .default(brandConfig.contactEmail),
  VITE_RECAPTCHA_SITE_KEY: z.string().trim().min(1).optional(),
  RECAPTCHA_SECRET_KEY: z.string().trim().min(1).optional(),
  RECAPTCHA_MIN_SCORE: optionalNumber.default(0.5),
  PUBLIC_APP_URL: optionalUrl,
  RESEND_API_KEY: z.string().trim().min(1).optional(),
  RESEND_WEBHOOK_SECRET: z.string().trim().min(1).optional(),
  BACKGROUND_TASKS_DRAIN_SECRET: z.string().trim().min(1).optional(),
  CRON_SECRET: z.string().trim().min(1).optional(),
})

type ServerEnv = z.infer<typeof serverEnvSchema>

let cachedEnv: ServerEnv | undefined

const parseServerEnv = (): ServerEnv => {
  const parsed = serverEnvSchema.safeParse(process.env)
  if (parsed.success) return parsed.data

  const details = parsed.error.issues.map(
    (issue) => `${issue.path.join('.')}: ${issue.message}`,
  )
  throw new Error(
    [
      'Invalid server environment configuration.',
      ...details.map((detail) => `- ${detail}`),
    ].join('\n'),
  )
}

export const getServerEnv = (): ServerEnv => {
  cachedEnv ??= parseServerEnv()
  return cachedEnv
}

export const env = new Proxy({} as ServerEnv, {
  get(_target, property) {
    const values = getServerEnv()
    return values[property as keyof ServerEnv]
  },
})
