import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { checkRateLimit } from '@/features/auth/server/rate-limit'
import { verifyRecaptchaToken } from '@/features/contact/server/recaptcha.server'
import { contactSubmissionSchema } from '@/features/email/schemas/contact'
import { sendContactSubmissionEmails } from '@/features/email/server/workflows.server'
import { db } from '@/lib/db'
import { contactSubmission } from '@/lib/db/schema'

export const submitContactFormFn = createServerFn({ method: 'POST' })
  .inputValidator(contactSubmissionSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()

    if (data.website) {
      throw new Error('Unable to process request.')
    }

    const submittedAt = Date.parse(data.submittedAt)
    if (!Number.isFinite(submittedAt)) {
      throw new Error('Invalid form timestamp.')
    }

    if (Date.now() - submittedAt < 1500) {
      throw new Error('Please wait a moment before submitting.')
    }

    const forwardedFor = headers.get('x-forwarded-for')
    const remoteIp = forwardedFor?.split(',')[0]?.trim() ?? null

    await verifyRecaptchaToken({
      token: data.recaptchaToken,
      remoteIp,
      expectedAction: 'contact_form',
    })

    const rateLimit = await checkRateLimit({
      key: `contact-form:${forwardedFor ?? 'local'}:${data.email.toLowerCase()}`,
      limit: 6,
      windowMs: 60_000,
    })

    if (!rateLimit.allowed) {
      throw new Error('Too many contact requests. Please wait before retrying.')
    }

    await sendContactSubmissionEmails({
      name: data.name,
      email: data.email,
      phone: data.phone,
      suburb: data.suburb,
      serviceInterest: data.serviceInterest,
      propertyType: data.propertyType,
      urgency: data.urgency,
      preferredContactMethod: data.preferredContactMethod,
      bestContactTime: data.bestContactTime,
      subject: data.subject,
      message: data.message,
      sourcePath: data.sourcePath,
      wantsCopy: data.wantsCopy,
    })

    await db.insert(contactSubmission).values({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      suburb: data.suburb,
      serviceInterest: data.serviceInterest,
      propertyType: data.propertyType,
      urgency: data.urgency,
      preferredContactMethod: data.preferredContactMethod,
      bestContactTime: data.bestContactTime || null,
      subject: data.subject,
      message: data.message,
      sourcePath: data.sourcePath,
      status: 'new',
      notes: null,
      assignedTo: null,
    })

    return { success: true }
  })
