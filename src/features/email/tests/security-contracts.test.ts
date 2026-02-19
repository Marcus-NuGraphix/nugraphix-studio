import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const emailServerPath = path.resolve(
  process.cwd(),
  'src/features/email/server/email.ts',
)
const contactServerPath = path.resolve(
  process.cwd(),
  'src/features/contact/server/contact.ts',
)

describe('public mutation rate-limit contracts', () => {
  it('keeps rate limiting on public contact and subscription entry points', async () => {
    const [emailSource, contactSource] = await Promise.all([
      readFile(emailServerPath, 'utf8'),
      readFile(contactServerPath, 'utf8'),
    ])

    expect(contactSource).toContain('submitContactFormFn = createServerFn')
    expect(contactSource).toContain('checkRateLimit({')
    expect(contactSource).toContain('contact-form:')

    expect(emailSource).toContain('subscribeToEmailTopicFn = createServerFn')
    expect(emailSource).toContain('email-subscribe:')
  })

  it('enforces rate limiting with token fingerprinting for unsubscribe tokens', async () => {
    const emailSource = await readFile(emailServerPath, 'utf8')

    expect(emailSource).toContain("import { createHash } from 'node:crypto'")
    expect(emailSource).toContain('const toTokenFingerprint = (token: string)')
    expect(emailSource).toContain('createHash(\'sha256\')')
    expect(emailSource).toContain('email-unsubscribe:')
    expect(emailSource).toContain('toTokenFingerprint(data.token)')
    expect(emailSource).toContain(
      'Too many unsubscribe attempts. Please wait before retrying.',
    )
  })
})

