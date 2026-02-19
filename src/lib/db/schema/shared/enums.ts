import { pgEnum } from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', ['user', 'admin'])
export const userStatus = pgEnum('user_status', [
  'active',
  'suspended',
  'invited',
])
export const userAuditAction = pgEnum('user_audit_action', [
  'user-created',
  'profile-updated',
  'password-changed',
  'role-updated',
  'status-suspended',
  'status-reactivated',
  'sessions-revoked',
  'session-revoked',
  'account-deleted',
])
export const userSecurityEventType = pgEnum('user_security_event_type', [
  'login-success',
  'password-changed',
  'sessions-revoked',
  'session-revoked',
])
export const postStatus = pgEnum('post_status', [
  'draft',
  'scheduled',
  'published',
  'archived',
])

export const contentStatus = pgEnum('content_status', [
  'draft',
  'scheduled',
  'published',
  'archived',
])

export const contactSubmissionStatus = pgEnum('contact_submission_status', [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'closed-won',
  'closed-lost',
])

export const mediaAssetType = pgEnum('media_asset_type', [
  'image',
  'document',
  'video',
  'audio',
  'other',
])

export const emailProvider = pgEnum('email_provider', ['noop', 'resend'])

export const emailMessageType = pgEnum('email_message_type', [
  'transactional',
  'editorial',
  'system',
])

export const emailMessageStatus = pgEnum('email_message_status', [
  'queued',
  'sent',
  'failed',
  'delivered',
  'bounced',
  'complained',
  'opened',
  'clicked',
  'suppressed',
])

export const emailTopic = pgEnum('email_topic', [
  'blog',
  'press',
  'product',
  'security',
  'account',
  'contact',
])

export const emailSubscriptionStatus = pgEnum('email_subscription_status', [
  'subscribed',
  'unsubscribed',
])

export const emailEventType = pgEnum('email_event_type', [
  'email.sent',
  'email.scheduled',
  'email.delivered',
  'email.delivery_delayed',
  'email.complained',
  'email.bounced',
  'email.opened',
  'email.clicked',
  'email.failed',
  'email.suppressed',
])

export const webVitalMetric = pgEnum('web_vital_metric', [
  'lcp',
  'inp',
  'cls',
  'fcp',
  'ttfb',
])

export const webVitalRating = pgEnum('web_vital_rating', [
  'good',
  'needs-improvement',
  'poor',
])

export const systemNotificationType = pgEnum('system_notification_type', [
  'success',
  'info',
  'warning',
  'error',
])
