import { relations } from 'drizzle-orm'
import { user } from '../auth/auth'
import { postCategoryToPost } from './post-category-relations'
import { postTagToPost } from './post-tag-relations'
import { post } from './posts'

export const postRelations = relations(post, ({ many, one }) => ({
  author: one(user, { fields: [post.authorId], references: [user.id] }),
  categoryLinks: many(postCategoryToPost),
  tagLinks: many(postTagToPost),
}))

