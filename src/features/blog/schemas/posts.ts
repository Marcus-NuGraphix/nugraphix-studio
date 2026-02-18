import { z } from 'zod'
import type { BlogDocJSON } from '@/features/blog/model/types'
import {
  blogAdminPostFiltersSchema,
  blogPublicPostFiltersSchema,
} from '@/features/blog/model/filters'
import { blogPostStatusValues } from '@/features/blog/model/types'

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const optionalUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .optional()
  .refine((value) => !value || /^https?:\/\//i.test(value), {
    message: 'Enter a valid URL starting with http:// or https://',
  })

const blogDocSchema = z.custom<BlogDocJSON>((value) => {
  if (!value || typeof value !== 'object') return false
  return (value as { type?: unknown }).type === 'doc'
}, {
  message: 'Editor payload must be a ProseMirror doc JSON object.',
})

const optionalStringSchema = z
  .string()
  .trim()
  .max(320)
  .optional()

export const blogPostEditorSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(slugPattern, 'Slug must be lowercase letters, numbers, and dashes.'),
  contentJson: blogDocSchema,
  excerpt: optionalStringSchema,
  coverImage: optionalUrlSchema,
  metaTitle: z.string().trim().max(180).optional(),
  metaDescription: optionalStringSchema,
  canonicalUrl: optionalUrlSchema,
  featured: z.boolean().default(false),
  isBreaking: z.boolean().default(false),
  status: z.enum(blogPostStatusValues).default('draft'),
}).refine((value) => value.status !== 'published' || Boolean(value.contentJson), {
  message: 'Published posts must include content.',
})

// Keep exported symbol names stable for route/server imports.
export const createBlogPostSchema = blogPostEditorSchema

export const updateBlogPostSchema = blogPostEditorSchema.extend({
  id: z.string().trim().min(1),
})

export const getBlogPostByIdSchema = z.object({
  id: z.string().trim().min(1),
})

export const getBlogPostBySlugSchema = z.object({
  slug: z.string().trim().min(3).max(200),
})

export const publishBlogPostSchema = z.object({
  id: z.string().trim().min(1),
})

export const unpublishBlogPostSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(['draft', 'archived']).default('draft'),
})

export const adminBlogFiltersInputSchema = blogAdminPostFiltersSchema
  .partial()
  .default({})

export const publicBlogFiltersInputSchema = blogPublicPostFiltersSchema
  .partial()
  .default({})

export type BlogPostEditorInput = z.infer<typeof blogPostEditorSchema>
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>
