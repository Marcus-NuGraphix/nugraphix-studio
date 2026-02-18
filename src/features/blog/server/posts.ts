import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { ServerResult } from '@/lib/errors'
import type { BlogPostRecord } from '@/features/blog/server/repository'
import {
  blogAdminPostFiltersSchema,
  blogPublicPostFiltersSchema,
} from '@/features/blog/model/filters'
import {
  estimateReadingTimeMinutes,
  parseBlogDoc,
  toBlogContentText,
  toBlogDocString,
  toExcerpt,
} from '@/features/blog/model/content'
import {
  adminBlogFiltersInputSchema,
  createBlogPostSchema,
  getBlogPostByIdSchema,
  getBlogPostBySlugSchema,
  publicBlogFiltersInputSchema,
  publishBlogPostSchema,
  unpublishBlogPostSchema,
  updateBlogPostSchema,
} from '@/features/blog/schemas/posts'
import { blogRepository } from '@/features/blog/server/repository'
import { fail, ok, toServerFail } from '@/lib/errors'
import { logMutationResult, logger } from '@/lib/observability'

const blogLogger = logger.child({ domain: 'blog' })

const getAdminSession = async () => {
  const { requireAdmin } = await import('@/features/auth/server/session.server')
  return requireAdmin()
}

const normalizeQuery = (value?: string) => {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : undefined
}

const optionalToNull = (value?: string) => {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : null
}

const mapPostDetail = (row: BlogPostRecord) => {
  const contentJson = parseBlogDoc(row.content)
  const contentText = toBlogContentText(contentJson)

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: row.status,
    contentJson,
    contentText,
    excerpt: row.excerpt,
    coverImage: row.coverImage,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    canonicalUrl: row.canonicalUrl,
    readingTimeMinutes: row.readingTimeMinutes,
    featured: row.featured,
    isBreaking: row.isBreaking,
    authorId: row.authorId,
    authorName: row.authorName,
    authorEmail: row.authorEmail,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export const getAdminBlogPostsFn = createServerFn({ method: 'GET' })
  .inputValidator(adminBlogFiltersInputSchema)
  .handler(async ({ data }) => {
    const filters = blogAdminPostFiltersSchema.parse({
      ...data,
      query: normalizeQuery(data.query),
    })

    await getAdminSession()

    const result = await blogRepository.listAdminPosts(filters)

    return {
      posts: result.posts,
      total: result.total,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: Math.max(1, Math.ceil(result.total / filters.pageSize)),
      filters,
    }
  })

export const getAdminBlogPostByIdFn = createServerFn({ method: 'GET' })
  .inputValidator(getBlogPostByIdSchema)
  .handler(async ({ data }): Promise<ServerResult<ReturnType<typeof mapPostDetail>>> => {
    try {
      await getAdminSession()

      const row = await blogRepository.findPostById(data.id)
      if (!row) {
        return fail('NOT_FOUND', 'Post not found')
      }

      return ok(mapPostDetail(row))
    } catch (error) {
      if (error instanceof Response) throw error
      return toServerFail(error)
    }
  })

export const getPublicBlogPostsFn = createServerFn({ method: 'GET' })
  .inputValidator(publicBlogFiltersInputSchema)
  .handler(async ({ data }) => {
    const filters = blogPublicPostFiltersSchema.parse({
      ...data,
      query: normalizeQuery(data.query),
    })

    const result = await blogRepository.listPublishedPosts(filters)

    return {
      posts: result.posts,
      total: result.total,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: Math.max(1, Math.ceil(result.total / filters.pageSize)),
      filters,
    }
  })

export const getPublicBlogPostBySlugFn = createServerFn({ method: 'GET' })
  .inputValidator(getBlogPostBySlugSchema)
  .handler(async ({ data }): Promise<ServerResult<ReturnType<typeof mapPostDetail>>> => {
    try {
      const row = await blogRepository.findPublishedPostBySlug(data.slug)
      if (!row) {
        return fail('NOT_FOUND', 'Post not found')
      }

      return ok(mapPostDetail(row))
    } catch (error) {
      if (error instanceof Response) throw error
      return toServerFail(error)
    }
  })

export const createBlogPostFn = createServerFn({ method: 'POST' })
  .inputValidator(createBlogPostSchema)
  .handler(async ({ data }): Promise<ServerResult<{ id: string; slug: string; status: string }>> => {
    const startedAt = Date.now()
    let userId: string | null = null

    try {
      const session = await getAdminSession()
      userId = session.user.id

      const existingBySlug = await blogRepository.findPostBySlug(data.slug)
      if (existingBySlug) {
        return fail('CONFLICT', 'A post with this slug already exists.')
      }

      const contentText = toBlogContentText(data.contentJson)
      const excerpt = toExcerpt(contentText, data.excerpt)
      const readingTimeMinutes = estimateReadingTimeMinutes(contentText)
      const publishedAt = data.status === 'published' ? new Date() : null

      const id = crypto.randomUUID()

      await blogRepository.createPost({
        id,
        title: data.title,
        slug: data.slug,
        content: toBlogDocString(data.contentJson),
        excerpt,
        coverImage: optionalToNull(data.coverImage),
        metaTitle: optionalToNull(data.metaTitle),
        metaDescription: optionalToNull(data.metaDescription),
        canonicalUrl: optionalToNull(data.canonicalUrl),
        readingTimeMinutes,
        featured: data.featured,
        isBreaking: data.isBreaking,
        status: data.status,
        authorId: session.user.id,
        publishedAt,
      })

      logMutationResult(blogLogger, {
        feature: 'blog',
        action: 'create-post',
        result: 'ok',
        userId,
        executionTimeMs: Date.now() - startedAt,
      })

      return ok({ id, slug: data.slug, status: data.status })
    } catch (error) {
      if (error instanceof Response) throw error
      const converted = toServerFail(error)
      logMutationResult(blogLogger, {
        feature: 'blog',
        action: 'create-post',
        result: 'fail',
        userId,
        errorCode: converted.error.code,
        executionTimeMs: Date.now() - startedAt,
      })
      return converted
    }
  })

export const updateBlogPostFn = createServerFn({ method: 'POST' })
  .inputValidator(updateBlogPostSchema)
  .handler(async ({ data }): Promise<ServerResult<{ id: string; slug: string; status: string }>> => {
    const startedAt = Date.now()
    let userId: string | null = null

    try {
      const session = await getAdminSession()
      userId = session.user.id

      const target = await blogRepository.findPostById(data.id)
      if (!target) {
        return fail('NOT_FOUND', 'Post not found')
      }

      const existingBySlug = await blogRepository.findPostBySlug(data.slug)
      if (existingBySlug && existingBySlug.id !== data.id) {
        return fail('CONFLICT', 'A post with this slug already exists.')
      }

      const contentText = toBlogContentText(data.contentJson)
      const excerpt = toExcerpt(contentText, data.excerpt)
      const readingTimeMinutes = estimateReadingTimeMinutes(contentText)

      const nextStatus = data.status
      const publishedAt =
        nextStatus === 'published'
          ? target.publishedAt ?? new Date()
          : nextStatus === 'scheduled'
            ? target.publishedAt
            : null

      await blogRepository.updatePost(data.id, {
        title: data.title,
        slug: data.slug,
        content: toBlogDocString(data.contentJson),
        excerpt,
        coverImage: optionalToNull(data.coverImage),
        metaTitle: optionalToNull(data.metaTitle),
        metaDescription: optionalToNull(data.metaDescription),
        canonicalUrl: optionalToNull(data.canonicalUrl),
        readingTimeMinutes,
        featured: data.featured,
        isBreaking: data.isBreaking,
        status: nextStatus,
        publishedAt,
      })

      logMutationResult(blogLogger, {
        feature: 'blog',
        action: 'update-post',
        result: 'ok',
        userId,
        executionTimeMs: Date.now() - startedAt,
      })

      return ok({ id: data.id, slug: data.slug, status: nextStatus })
    } catch (error) {
      if (error instanceof Response) throw error
      const converted = toServerFail(error)
      logMutationResult(blogLogger, {
        feature: 'blog',
        action: 'update-post',
        result: 'fail',
        userId,
        errorCode: converted.error.code,
        executionTimeMs: Date.now() - startedAt,
      })
      return converted
    }
  })

export const publishBlogPostFn = createServerFn({ method: 'POST' })
  .inputValidator(publishBlogPostSchema)
  .handler(async ({ data }): Promise<ServerResult<{ id: string; status: string }>> => {
    const startedAt = Date.now()
    let userId: string | null = null

    try {
      const session = await getAdminSession()
      userId = session.user.id

      const target = await blogRepository.findPostById(data.id)
      if (!target) {
        return fail('NOT_FOUND', 'Post not found')
      }

      await blogRepository.updatePostStatus(data.id, 'published', new Date())

      logMutationResult(blogLogger, {
        feature: 'blog',
        action: 'publish-post',
        result: 'ok',
        userId,
        executionTimeMs: Date.now() - startedAt,
      })

      return ok({ id: data.id, status: 'published' })
    } catch (error) {
      if (error instanceof Response) throw error
      const converted = toServerFail(error)
      logMutationResult(blogLogger, {
        feature: 'blog',
        action: 'publish-post',
        result: 'fail',
        userId,
        errorCode: converted.error.code,
        executionTimeMs: Date.now() - startedAt,
      })
      return converted
    }
  })

export const unpublishBlogPostFn = createServerFn({ method: 'POST' })
  .inputValidator(unpublishBlogPostSchema)
  .handler(async ({ data }): Promise<ServerResult<{ id: string; status: string }>> => {
    const startedAt = Date.now()
    let userId: string | null = null

    try {
      const session = await getAdminSession()
      userId = session.user.id

      const target = await blogRepository.findPostById(data.id)
      if (!target) {
        return fail('NOT_FOUND', 'Post not found')
      }

      await blogRepository.updatePostStatus(data.id, data.status, null)

      logMutationResult(blogLogger, {
        feature: 'blog',
        action: 'unpublish-post',
        result: 'ok',
        userId,
        executionTimeMs: Date.now() - startedAt,
      })

      return ok({ id: data.id, status: data.status })
    } catch (error) {
      if (error instanceof Response) throw error
      const converted = toServerFail(error)
      logMutationResult(blogLogger, {
        feature: 'blog',
        action: 'unpublish-post',
        result: 'fail',
        userId,
        errorCode: converted.error.code,
        executionTimeMs: Date.now() - startedAt,
      })
      return converted
    }
  })

export const blogPostIdSearchSchema = z.object({
  id: z.string().trim().min(1),
})
