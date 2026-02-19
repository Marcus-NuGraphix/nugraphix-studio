import { and, asc, desc, eq, ilike, lte, or, sql } from 'drizzle-orm'
import type {
  BlogAdminPostFiltersInput,
  BlogAdminPostListItem,
  BlogPostStatus,
  BlogPublicPostFiltersInput,
  BlogPublicPostListItem,
} from '@/features/blog/model/types'
import { db } from '@/lib/db'
import { post, user } from '@/lib/db/schema'

export interface BlogPostRecord {
  id: string
  title: string
  slug: string
  status: BlogPostStatus
  content: string
  excerpt: string | null
  coverImage: string | null
  metaTitle: string | null
  metaDescription: string | null
  canonicalUrl: string | null
  readingTimeMinutes: number
  featured: boolean
  isBreaking: boolean
  authorId: string
  authorName: string
  authorEmail: string
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

const toAdminWhereClause = (filters: BlogAdminPostFiltersInput) => {
  const conditions = []

  if (filters.query) {
    conditions.push(
      or(
        ilike(post.title, `%${filters.query}%`),
        ilike(post.slug, `%${filters.query}%`),
        ilike(post.excerpt, `%${filters.query}%`),
      ),
    )
  }

  if (filters.status) {
    conditions.push(eq(post.status, filters.status))
  }

  if (conditions.length === 0) return undefined
  return and(...conditions)
}

const toAdminOrderBy = (sort: BlogAdminPostFiltersInput['sort']) => {
  if (sort === 'updated-asc') return asc(post.updatedAt)
  if (sort === 'title-asc') return asc(post.title)
  if (sort === 'title-desc') return desc(post.title)
  if (sort === 'published-desc') return desc(post.publishedAt)
  return desc(post.updatedAt)
}

const toPublicWhereClause = (filters: BlogPublicPostFiltersInput) => {
  const base = [eq(post.status, 'published'), lte(post.publishedAt, new Date())]

  if (filters.query) {
    base.push(
      or(
        ilike(post.title, `%${filters.query}%`),
        ilike(post.excerpt, `%${filters.query}%`),
      )!,
    )
  }

  return and(...base)
}

const listAdminPosts = async (filters: BlogAdminPostFiltersInput) => {
  const whereClause = toAdminWhereClause(filters)
  const offset = (filters.page - 1) * filters.pageSize

  const [rows, [totalRow]] = await Promise.all([
    db
      .select({
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status,
        excerpt: post.excerpt,
        featured: post.featured,
        isBreaking: post.isBreaking,
        readingTimeMinutes: post.readingTimeMinutes,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        authorName: user.name,
        authorEmail: user.email,
      })
      .from(post)
      .innerJoin(user, eq(user.id, post.authorId))
      .where(whereClause)
      .orderBy(toAdminOrderBy(filters.sort))
      .limit(filters.pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(post)
      .where(whereClause),
  ])

  return {
    posts: rows as Array<BlogAdminPostListItem>,
    total: Number(totalRow.count),
  }
}

const listPublishedPosts = async (filters: BlogPublicPostFiltersInput) => {
  const whereClause = toPublicWhereClause(filters)
  const offset = (filters.page - 1) * filters.pageSize

  const [rows, [totalRow]] = await Promise.all([
    db
      .select({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        featured: post.featured,
        readingTimeMinutes: post.readingTimeMinutes,
        publishedAt: post.publishedAt,
      })
      .from(post)
      .where(whereClause)
      .orderBy(desc(post.publishedAt), desc(post.updatedAt))
      .limit(filters.pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(post)
      .where(whereClause),
  ])

  return {
    posts: rows.filter((row) => row.publishedAt !== null) as Array<
      BlogPublicPostListItem
    >,
    total: Number(totalRow.count),
  }
}

const findPostById = async (id: string): Promise<BlogPostRecord | null> => {
  const rows = await db
    .select({
      id: post.id,
      title: post.title,
      slug: post.slug,
      status: post.status,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      canonicalUrl: post.canonicalUrl,
      readingTimeMinutes: post.readingTimeMinutes,
      featured: post.featured,
      isBreaking: post.isBreaking,
      authorId: post.authorId,
      authorName: user.name,
      authorEmail: user.email,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    })
    .from(post)
    .innerJoin(user, eq(user.id, post.authorId))
    .where(eq(post.id, id))
  return (rows[0] ?? null) as BlogPostRecord | null
}

const findPostBySlug = async (
  slug: string,
): Promise<(typeof post.$inferSelect) | null> => {
  const row = await db.query.post.findFirst({
    where: eq(post.slug, slug),
  })
  return row ?? null
}

const findPublishedPostBySlug = async (
  slug: string,
): Promise<BlogPostRecord | null> => {
  const rows = await db
    .select({
      id: post.id,
      title: post.title,
      slug: post.slug,
      status: post.status,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      canonicalUrl: post.canonicalUrl,
      readingTimeMinutes: post.readingTimeMinutes,
      featured: post.featured,
      isBreaking: post.isBreaking,
      authorId: post.authorId,
      authorName: user.name,
      authorEmail: user.email,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    })
    .from(post)
    .innerJoin(user, eq(user.id, post.authorId))
    .where(
      and(
        eq(post.slug, slug),
        eq(post.status, 'published'),
        lte(post.publishedAt, new Date()),
      ),
    )
  return (rows[0] ?? null) as BlogPostRecord | null
}

const createPost = (input: {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  metaTitle: string | null
  metaDescription: string | null
  canonicalUrl: string | null
  readingTimeMinutes: number
  featured: boolean
  isBreaking: boolean
  status: BlogPostStatus
  authorId: string
  publishedAt: Date | null
}) => db.insert(post).values(input)

const updatePost = (
  id: string,
  input: {
    title: string
    slug: string
    content: string
    excerpt: string | null
    coverImage: string | null
    metaTitle: string | null
    metaDescription: string | null
    canonicalUrl: string | null
    readingTimeMinutes: number
    featured: boolean
    isBreaking: boolean
    status: BlogPostStatus
    publishedAt: Date | null
  },
) =>
  db
    .update(post)
    .set(input)
    .where(eq(post.id, id))

const updatePostStatus = (
  id: string,
  status: BlogPostStatus,
  publishedAt: Date | null,
) =>
  db
    .update(post)
    .set({ status, publishedAt })
    .where(eq(post.id, id))

export const blogRepository = {
  createPost,
  findPostById,
  findPostBySlug,
  findPublishedPostBySlug,
  listAdminPosts,
  listPublishedPosts,
  updatePost,
  updatePostStatus,
}
