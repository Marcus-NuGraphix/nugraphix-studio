import type { EmailProvider } from '@/features/email/server/provider'
import { noopEmailProvider } from '@/features/email/server/noop-provider.server'
import { resendEmailProvider } from '@/features/email/server/resend-provider.server'
import { env } from '@/lib/env/server'

export const getEmailProvider = (): EmailProvider => {
  if (env.EMAIL_PROVIDER === 'resend') {
    return resendEmailProvider
  }

  return noopEmailProvider
}
