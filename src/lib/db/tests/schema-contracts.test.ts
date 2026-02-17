import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  contentStatus,
  emailMessageStatus,
  emailProvider,
  postStatus,
  userRole,
} from '../schema/shared/enums'

const schemaDir = path.resolve(process.cwd(), 'src/lib/db/schema')

const listSchemaFiles = async (directory: string): Promise<Array<string>> => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        return listSchemaFiles(fullPath)
      }
      return [fullPath]
    }),
  )

  return files.flat()
}

describe('db enum contracts', () => {
  it('keeps critical workflow enums stable', () => {
    expect(userRole.enumValues).toEqual(['user', 'admin'])
    expect(emailProvider.enumValues).toEqual(['noop', 'resend'])
    expect(postStatus.enumValues).toEqual([
      'draft',
      'scheduled',
      'published',
      'archived',
    ])
    expect(contentStatus.enumValues).toEqual([
      'draft',
      'scheduled',
      'published',
      'archived',
    ])
    expect(emailMessageStatus.enumValues).toEqual([
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
  })
})

describe('db schema timestamp policy', () => {
  it('does not use raw timestamp() in schema modules', async () => {
    const files = await listSchemaFiles(schemaDir)

    const targetFiles = files.filter((file) => {
      const relative = path.relative(schemaDir, file).replaceAll('\\', '/')

      return (
        relative.endsWith('.ts') &&
        !relative.endsWith('.test.ts') &&
        !relative.endsWith('/index.ts') &&
        relative !== 'index.ts' &&
        relative !== 'shared/timestamps.ts'
      )
    })

    const contents = await Promise.all(
      targetFiles.map((file) => readFile(file, 'utf8')),
    )

    for (const content of contents) {
      expect(content).not.toMatch(/\btimestamp\(/)
      expect(content).not.toMatch(/\btimestamp\s*[,}]/)
    }
  })
})

describe('db schema integrity checks', () => {
  it('includes critical check constraints for publishing and email state', async () => {
    const [postsSchema, pressSchema, emailMessageSchema, emailSubscription] =
      await Promise.all([
        readFile(path.join(schemaDir, 'blog/posts.ts'), 'utf8'),
        readFile(path.join(schemaDir, 'blog/press-releases.ts'), 'utf8'),
        readFile(path.join(schemaDir, 'email/email-messages.ts'), 'utf8'),
        readFile(path.join(schemaDir, 'email/email-subscriptions.ts'), 'utf8'),
      ])

    expect(postsSchema).toContain(
      'post_published_at_required_for_published_chk',
    )
    expect(pressSchema).toContain(
      'press_release_published_at_required_for_published_chk',
    )
    expect(emailMessageSchema).toContain(
      'email_message_attempts_non_negative_chk',
    )
    expect(emailSubscription).toContain(
      'email_subscription_unsubscribed_state_chk',
    )
  })

  it('keeps Better Auth database rate-limit table contract compatible', async () => {
    const authSchema = await readFile(
      path.join(schemaDir, 'auth/auth.ts'),
      'utf8',
    )

    expect(authSchema).toContain('export const rateLimit = pgTable(')
    expect(authSchema).toContain("id: text('id').notNull().unique()")
    expect(authSchema).toContain("key: text('key').primaryKey()")
    expect(authSchema).toContain("count: integer('count').notNull()")
    expect(authSchema).toContain(
      "lastRequest: bigint('last_request', { mode: 'number' }).notNull()",
    )
  })
})
