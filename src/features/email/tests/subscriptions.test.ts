import { describe, expect, it } from 'vitest'
import {
  emailSubscriptionSchema,
  emailUnsubscribeTokenSchema,
} from '@/features/email/schemas/subscriptions'

describe('email subscription schemas', () => {
  it('normalizes valid subscription payloads', () => {
    const result = emailSubscriptionSchema.safeParse({
      email: 'reader@example.com',
      topic: 'blog',
      source: 'public',
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid unsubscribe tokens', () => {
    const result = emailUnsubscribeTokenSchema.safeParse({ token: 'short' })
    expect(result.success).toBe(false)
  })
})
