// Client
export {
  bulkRetryEmailsFn,
  getAdminEmailMessagesFn,
  getAdminEmailMessageDetailFn,
  getAdminEmailOverviewFn,
  getMyEmailPreferencesFn,
  retryEmailMessageFn,
  subscribeToEmailTopicFn,
  unsubscribeByTokenFn,
  unsubscribeByTokenSearchSchema,
  updateMyEmailPreferencesFn,
} from '@/features/email/client/email'

// Model
export type {
  EmailProvider,
  EmailMessageType,
  EmailMessageStatus,
  EmailTopic,
  EmailSubscriptionStatus,
  EmailTemplateKey,
  EmailPreferenceFlags,
  UserEmailPreferences,
} from '@/features/email/model/types'
export {
  emailTopicValues,
  emailMessageStatusValues,
  emailTemplateKeyValues,
} from '@/features/email/model/types'

// Lib
export { emailQueryKeys } from '@/features/email/lib/query-keys'

// UI
export { EmailPreferencesForm } from '@/features/email/ui/account/email-preferences-form'
export { EmailMessagesTable } from '@/features/email/ui/admin/email-messages-table'
export { EmailOverviewCards } from '@/features/email/ui/admin/email-overview-cards'
export { EmailDeliveryFunnel } from '@/features/email/ui/admin/email-delivery-funnel'
export { EmailDetailDrawer } from '@/features/email/ui/admin/email-detail-drawer'
export { EmailFilters } from '@/features/email/ui/admin/email-filters'
export { EmailSubscribeCard } from '@/features/email/ui/public/email-subscribe-card'
export { NewsletterSignupPanel } from '@/features/email/ui/public/newsletter-signup-panel'
