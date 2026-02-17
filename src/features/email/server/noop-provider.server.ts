import type {
  EmailProvider,
  EmailSendRequest,
} from '@/features/email/server/provider'
import { logger } from '@/lib/server'

const emailLogger = logger.child({ domain: 'email', provider: 'noop' })

export const noopEmailProvider: EmailProvider = {
  name: 'noop',
  send(request: EmailSendRequest) {
    const providerMessageId = `noop-${crypto.randomUUID()}`
    emailLogger.info('email.sent.noop', {
      providerMessageId,
      to: request.to,
      subject: request.subject,
    })

    return Promise.resolve({ providerMessageId })
  },
}
