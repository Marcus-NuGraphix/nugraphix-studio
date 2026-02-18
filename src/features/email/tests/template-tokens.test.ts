import { describe, expect, it } from 'vitest'
import { emailTemplateTokens } from '@/features/email/server/template-tokens'

describe('email template token contract', () => {
  it('exposes required semantic color tokens', () => {
    expect(emailTemplateTokens.colors.bodyBackground).toBeDefined()
    expect(emailTemplateTokens.colors.surface).toBeDefined()
    expect(emailTemplateTokens.colors.textHeading).toBeDefined()
    expect(emailTemplateTokens.colors.textBody).toBeDefined()
    expect(emailTemplateTokens.colors.textMuted).toBeDefined()
    expect(emailTemplateTokens.colors.ctaBackground).toBeDefined()
    expect(emailTemplateTokens.colors.ctaForeground).toBeDefined()
    expect(emailTemplateTokens.colors.divider).toBeDefined()
  })

  it('keeps spacing and typography tokens centralized', () => {
    expect(emailTemplateTokens.spacing.containerPadding).toBe('24px')
    expect(emailTemplateTokens.spacing.sectionMargin).toBe('20px 0')
    expect(emailTemplateTokens.typography.fontFamily).toContain('Inter')
  })
})
