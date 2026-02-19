import { z } from 'zod'
import {
  contactPreferredContactValues,
  contactPropertyTypeValues,
  contactServiceInterestValues,
  contactUrgencyValues,
} from '@/features/contact/model/lead-form'
import { emailTopicValues } from '@/features/email/model/types'

const optionalTrimmed = z
  .string()
  .trim()
  .max(120)
  .optional()
  .transform((value) => value ?? '')

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email(),
  phone: z.string().trim().min(7).max(40),
  suburb: z.string().trim().min(2).max(120),
  serviceInterest: z.enum(contactServiceInterestValues),
  propertyType: z.enum(contactPropertyTypeValues),
  urgency: z.enum(contactUrgencyValues),
  preferredContactMethod: z.enum(contactPreferredContactValues),
  bestContactTime: optionalTrimmed,
  subject: z.string().trim().min(3).max(180),
  message: z.string().trim().min(15).max(5000),
  consentToContact: z.literal(true),
  wantsCopy: z.boolean().default(true),
  recaptchaToken: z.string().trim().min(20).max(4000),
  sourcePath: z.string().trim().min(1).max(200).default('/contact'),
  submittedAt: z.iso.datetime(),
  website: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((value) => value ?? ''),
  topic: z.enum(emailTopicValues).default('contact'),
})

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>
