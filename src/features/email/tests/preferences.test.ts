import { describe, expect, it } from 'vitest'
import { emailPreferenceUpdateSchema } from '@/features/email/schemas/preferences'

describe('emailPreferenceUpdateSchema', () => {
  it('requires transactional emails to stay enabled', () => {
    const result = emailPreferenceUpdateSchema.safeParse({
      transactionalEnabled: false,
      editorialEnabled: true,
      blogUpdatesEnabled: true,
      pressUpdatesEnabled: false,
      productUpdatesEnabled: false,
      securityAlertsEnabled: true,
    })

    expect(result.success).toBe(false)
  })

  it('requires at least one editorial topic when editorial is enabled', () => {
    const result = emailPreferenceUpdateSchema.safeParse({
      transactionalEnabled: true,
      editorialEnabled: true,
      blogUpdatesEnabled: false,
      pressUpdatesEnabled: false,
      productUpdatesEnabled: false,
      securityAlertsEnabled: true,
    })

    expect(result.success).toBe(false)
  })

  it('allows disabling editorial with no topic enabled', () => {
    const result = emailPreferenceUpdateSchema.safeParse({
      transactionalEnabled: true,
      editorialEnabled: false,
      blogUpdatesEnabled: false,
      pressUpdatesEnabled: false,
      productUpdatesEnabled: false,
      securityAlertsEnabled: true,
    })

    expect(result.success).toBe(true)
  })
})
