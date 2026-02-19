export const emailProviderValues = ['noop', 'resend'] as const
export type EmailProvider = (typeof emailProviderValues)[number]

export const emailMessageTypeValues = [
  'transactional',
  'editorial',
  'system',
] as const
export type EmailMessageType = (typeof emailMessageTypeValues)[number]

export const emailMessageStatusValues = [
  'queued',
  'sent',
  'failed',
  'delivered',
  'bounced',
  'complained',
  'opened',
  'clicked',
  'suppressed',
] as const
export type EmailMessageStatus = (typeof emailMessageStatusValues)[number]

export const emailTopicValues = [
  'blog',
  'press',
  'product',
  'security',
  'account',
  'contact',
] as const
export type EmailTopic = (typeof emailTopicValues)[number]

export const emailSubscriptionStatusValues = [
  'subscribed',
  'unsubscribed',
] as const
export type EmailSubscriptionStatus =
  (typeof emailSubscriptionStatusValues)[number]

export const emailTemplateKeyValues = [
  'auth-welcome',
  'auth-verify-email',
  'auth-reset-password',
  'security-password-changed',
  'security-sessions-revoked',
  'editorial-blog-published',
  'editorial-press-published',
  'contact-admin-notification',
  'contact-user-confirmation',
] as const
export type EmailTemplateKey = (typeof emailTemplateKeyValues)[number]

export interface EmailPreferenceFlags {
  transactionalEnabled: boolean
  editorialEnabled: boolean
  blogUpdatesEnabled: boolean
  pressUpdatesEnabled: boolean
  productUpdatesEnabled: boolean
  securityAlertsEnabled: boolean
}

export interface UserEmailPreferences extends EmailPreferenceFlags {
  userId: string
  updatedAt: Date
}

export const defaultUserEmailPreferences: EmailPreferenceFlags = {
  transactionalEnabled: true,
  editorialEnabled: true,
  blogUpdatesEnabled: true,
  pressUpdatesEnabled: true,
  productUpdatesEnabled: false,
  securityAlertsEnabled: true,
}
