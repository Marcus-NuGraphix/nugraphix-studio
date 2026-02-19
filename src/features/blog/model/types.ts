import type { NodeJSON } from 'prosekit/core'

export const blogPostStatusValues = [
  'draft',
  'scheduled',
  'published',
  'archived',
] as const

export type BlogPostStatus = (typeof blogPostStatusValues)[number]

export type BlogDocJSON = NodeJSON

export interface BlogAdminPostListItem {
  id: string
  title: string
  slug: string
  status: BlogPostStatus
  excerpt: string | null
  featured: boolean
  isBreaking: boolean
  readingTimeMinutes: number
  publishedAt: Date | null
  updatedAt: Date
  createdAt: Date
  authorName: string
  authorEmail: string
}

export interface BlogPublicPostListItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  readingTimeMinutes: number
  featured: boolean
  publishedAt: Date
}

export interface BlogPostDetail {
  id: string
  title: string
  slug: string
  status: BlogPostStatus
  contentJson: BlogDocJSON
  contentText: string
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

export interface BlogAdminPostFiltersInput {
  query?: string
  status?: BlogPostStatus
  page: number
  pageSize: number
  sort: 'updated-desc' | 'updated-asc' | 'title-asc' | 'title-desc' | 'published-desc'
}

export interface BlogPublicPostFiltersInput {
  query?: string
  page: number
  pageSize: number
}
