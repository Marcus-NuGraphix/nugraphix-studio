import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const blogServerPath = path.resolve(
  process.cwd(),
  'src/features/blog/server/posts.ts',
)

describe('blog incident contracts', () => {
  it('tracks publish-flow failures with escalation guardrails', async () => {
    const source = await readFile(blogServerPath, 'utf8')

    expect(source).toContain('recordFailureForEscalation(')
    expect(source).toContain("incidentKey: 'blog.publish-flow'")
    expect(source).toContain("category: 'publish-flow'")
    expect(source).toContain("severity: 'S2'")
    expect(source).toContain("action: 'publish-post'")
    expect(source).toContain("action: 'unpublish-post'")
    expect(source).toContain('resolveFailureEscalation(')
  })
})

