import { z } from 'zod'
import { emailTopicValues } from '@/features/email/model/types'

export const emailSubscriptionSchema = z.object({
  email: z.email(),
  topic: z.enum(emailTopicValues).default('blog'),
  source: z.string().trim().min(2).max(60).default('public'),
})

export const emailUnsubscribeTokenSchema = z.object({
  token: z.string().trim().min(16).max(256),
})

export type EmailSubscriptionInput = z.infer<typeof emailSubscriptionSchema>
