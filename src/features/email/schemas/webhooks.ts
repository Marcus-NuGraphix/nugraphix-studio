import { z } from 'zod'

export const resendWebhookEnvelopeSchema = z.object({
  type: z.string().min(1),
  created_at: z.string().datetime().optional(),
  data: z.record(z.string(), z.unknown()),
})

export type ResendWebhookEnvelope = z.infer<typeof resendWebhookEnvelopeSchema>
