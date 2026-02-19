import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const blogServerPath = path.resolve(
  process.cwd(),
  'src/features/blog/server/posts.ts',
)
const blogRepositoryPath = path.resolve(
  process.cwd(),
  'src/features/blog/server/repository.ts',
)
const publicSlugRoutePath = path.resolve(
  process.cwd(),
  'src/routes/_public/blog/$slug.tsx',
)

describe('blog security contracts', () => {
  it('keeps deterministic CONFLICT mapping for slug collisions', async () => {
    const source = await readFile(blogServerPath, 'utf8')
    const conflictMatches = source.match(
      /fail\('CONFLICT', 'A post with this slug already exists\.'\)/g,
    )

    expect(conflictMatches?.length).toBe(2)
  })

  it('requires admin session checks for blog publish lifecycle mutations', async () => {
    const source = await readFile(blogServerPath, 'utf8')

    expect(source).toContain('await getAdminSession()')
    expect(source).toContain(
      "export const createBlogPostFn = createServerFn({ method: 'POST' })",
    )
    expect(source).toContain(
      "export const updateBlogPostFn = createServerFn({ method: 'POST' })",
    )
    expect(source).toContain(
      "export const publishBlogPostFn = createServerFn({ method: 'POST' })",
    )
    expect(source).toContain(
      "export const unpublishBlogPostFn = createServerFn({ method: 'POST' })",
    )
  })

  it('guards public reads behind published-state repository selectors', async () => {
    const [repositorySource, routeSource] = await Promise.all([
      readFile(blogRepositoryPath, 'utf8'),
      readFile(publicSlugRoutePath, 'utf8'),
    ])

    expect(repositorySource).toContain("eq(post.status, 'published')")
    expect(repositorySource).toContain('lte(post.publishedAt, new Date())')
    expect(repositorySource).toContain('findPublishedPostBySlug')
    expect(routeSource).toContain('getPublicBlogPostBySlugFn')
  })

  it('rethrows framework control responses in guarded server handlers', async () => {
    const source = await readFile(blogServerPath, 'utf8')
    const controlSignalRethrows = source.match(
      /if \(error instanceof Response\) throw error/g,
    )

    expect(controlSignalRethrows?.length).toBeGreaterThanOrEqual(4)
  })
})

