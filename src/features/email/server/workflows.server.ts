import type { User } from 'better-auth'
import { emailRepository } from '@/features/email/server/repository.server'
import {
  queueBulkTemplatedEmail,
  queueTemplatedEmail,
} from '@/features/email/server/send.server'
import { env } from '@/lib/env/server'

const getAppBaseUrl = () => env.PUBLIC_APP_URL ?? env.BETTER_AUTH_BASE_URL

const toUrl = (pathname: string) => {
  const base = getAppBaseUrl().replace(/\/$/, '')
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${base}${path}`
}

export const sendWelcomeEmail = async (
  user: Pick<User, 'id' | 'email' | 'name'>,
) =>
  queueTemplatedEmail({
    toEmail: user.email,
    toUserId: user.id,
    templateKey: 'auth-welcome',
    templateData: {
      name: user.name,
      dashboardUrl: toUrl('/account'),
    },
    messageType: 'transactional',
    topic: 'account',
    correlationKey: `user:${user.id}:welcome`,
    idempotencyKey: `user:${user.id}:welcome`,
  })

export const sendVerificationEmail = async ({
  user,
  verificationUrl,
}: {
  user: Pick<User, 'id' | 'email' | 'name'>
  verificationUrl: string
}) =>
  queueTemplatedEmail({
    toEmail: user.email,
    toUserId: user.id,
    templateKey: 'auth-verify-email',
    templateData: {
      name: user.name,
      verificationUrl,
    },
    messageType: 'transactional',
    topic: 'account',
    correlationKey: `user:${user.id}:verify-email`,
    idempotencyKey: `user:${user.id}:verify-email:${verificationUrl}`,
  })

export const sendResetPasswordEmail = async ({
  user,
  resetUrl,
}: {
  user: Pick<User, 'id' | 'email' | 'name'>
  resetUrl: string
}) =>
  queueTemplatedEmail({
    toEmail: user.email,
    toUserId: user.id,
    templateKey: 'auth-reset-password',
    templateData: {
      name: user.name,
      resetUrl,
    },
    messageType: 'transactional',
    topic: 'account',
    correlationKey: `user:${user.id}:reset-password`,
  })

export const sendPasswordChangedEmail = async ({
  user,
  timestamp,
}: {
  user: Pick<User, 'id' | 'email' | 'name'>
  timestamp: string
}) =>
  queueTemplatedEmail({
    toEmail: user.email,
    toUserId: user.id,
    templateKey: 'security-password-changed',
    templateData: {
      name: user.name,
      timestamp,
      securityUrl: toUrl('/account'),
    },
    messageType: 'transactional',
    topic: 'security',
    correlationKey: `user:${user.id}:password-changed:${timestamp}`,
  })

export const sendSessionsRevokedEmail = async ({
  user,
  timestamp,
}: {
  user: Pick<User, 'id' | 'email' | 'name'>
  timestamp: string
}) =>
  queueTemplatedEmail({
    toEmail: user.email,
    toUserId: user.id,
    templateKey: 'security-sessions-revoked',
    templateData: {
      name: user.name,
      timestamp,
      securityUrl: toUrl('/account'),
    },
    messageType: 'transactional',
    topic: 'security',
    correlationKey: `user:${user.id}:sessions-revoked:${timestamp}`,
  })

export const sendBlogPublishedEmails = async (post: {
  id: string
  title: string
  excerpt?: string | null
  slug: string
}) => {
  const recipients = await emailRepository.listEditorialRecipients('blog')

  if (recipients.length === 0) {
    return { queued: 0, failed: 0 }
  }

  return queueBulkTemplatedEmail({
    recipients,
    templateKey: 'editorial-blog-published',
    messageType: 'editorial',
    topic: 'blog',
    correlationKey: `blog:${post.id}:published`,
    makePayload: (recipient) => ({
      title: post.title,
      excerpt: post.excerpt,
      postUrl: toUrl(`/blog/${post.slug}`),
      manageUrl: toUrl('/account/notifications'),
      unsubscribeUrl: recipient.unsubscribeToken
        ? toUrl(`/unsubscribe?token=${recipient.unsubscribeToken}`)
        : null,
    }),
  })
}

export const sendPressPublishedEmails = async (release: {
  id: string
  title: string
  summary?: string | null
  slug: string
}) => {
  const recipients = await emailRepository.listEditorialRecipients('press')

  if (recipients.length === 0) {
    return { queued: 0, failed: 0 }
  }

  return queueBulkTemplatedEmail({
    recipients,
    templateKey: 'editorial-press-published',
    messageType: 'editorial',
    topic: 'press',
    correlationKey: `press:${release.id}:published`,
    makePayload: (recipient) => ({
      title: release.title,
      summary: release.summary,
      releaseUrl: toUrl('/blog'),
      manageUrl: toUrl('/account/notifications'),
      unsubscribeUrl: recipient.unsubscribeToken
        ? toUrl(`/unsubscribe?token=${recipient.unsubscribeToken}`)
        : null,
    }),
  })
}

export const sendContactSubmissionEmails = async ({
  name,
  email,
  phone,
  suburb,
  serviceInterest,
  propertyType,
  urgency,
  preferredContactMethod,
  bestContactTime,
  subject,
  message,
  sourcePath,
  wantsCopy,
}: {
  name: string
  email: string
  phone?: string
  suburb?: string
  serviceInterest?: string
  propertyType?: string
  urgency?: string
  preferredContactMethod?: string
  bestContactTime?: string
  subject: string
  message: string
  sourcePath?: string
  wantsCopy: boolean
}) => {
  const supportEmail = env.CONTACT_NOTIFICATION_EMAIL
  const resolvedPhone = phone ?? 'Not provided'
  const resolvedSuburb = suburb ?? 'Not provided'
  const resolvedServiceInterest = serviceInterest ?? 'discovery-consultation'
  const resolvedPropertyType = propertyType ?? 'other'
  const resolvedUrgency = urgency ?? 'planning'
  const resolvedPreferredContactMethod = preferredContactMethod ?? 'email'
  const resolvedBestContactTime = bestContactTime ?? ''
  const resolvedSourcePath = sourcePath ?? '/contact'

  const adminSend = await queueTemplatedEmail({
    toEmail: supportEmail,
    templateKey: 'contact-admin-notification',
    templateData: {
      name,
      email,
      phone: resolvedPhone,
      suburb: resolvedSuburb,
      serviceInterest: resolvedServiceInterest,
      propertyType: resolvedPropertyType,
      urgency: resolvedUrgency,
      preferredContactMethod: resolvedPreferredContactMethod,
      bestContactTime: resolvedBestContactTime,
      subject,
      message,
      sourcePath: resolvedSourcePath,
    },
    messageType: 'transactional',
    topic: 'contact',
    correlationKey: `contact:${email}:${Date.now()}`,
  })

  if (!wantsCopy) {
    return { adminSend, userSend: null }
  }

  const userSend = await queueTemplatedEmail({
    toEmail: email,
    templateKey: 'contact-user-confirmation',
    templateData: {
      name,
      supportEmail,
    },
    messageType: 'transactional',
    topic: 'contact',
    correlationKey: `contact-ack:${email}:${Date.now()}`,
  })

  return { adminSend, userSend }
}
