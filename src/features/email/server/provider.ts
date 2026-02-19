export interface EmailSendRequest {
  to: string
  subject: string
  html: string
  text: string
  from: string
  replyTo?: string | null
  idempotencyKey?: string | null
  scheduledAt?: Date | null
  tags?: Array<{ name: string; value: string }>
}

export interface EmailSendResult {
  providerMessageId: string | null
  raw?: unknown
}

export interface EmailProvider {
  readonly name: 'noop' | 'resend'
  send: (request: EmailSendRequest) => Promise<EmailSendResult>
}
