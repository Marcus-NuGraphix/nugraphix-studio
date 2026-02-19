import { relations } from 'drizzle-orm'
import { index, pgTable, primaryKey, text } from 'drizzle-orm/pg-core'
import { post } from './posts'
import { postCategory } from './post-categories'

export const postCategoryToPost = pgTable(
  'post_category_to_post',
  {
    postId: text('post_id')
      .notNull()
      .references(() => post.id, { onDelete: 'cascade' }),
    categoryId: text('category_id')
      .notNull()
      .references(() => postCategory.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.categoryId] }),
    index('post_category_to_post_post_idx').on(table.postId),
    index('post_category_to_post_category_idx').on(table.categoryId),
  ],
)

export const postCategoryToPostRelations = relations(
  postCategoryToPost,
  ({ one }) => ({
    post: one(post, {
      fields: [postCategoryToPost.postId],
      references: [post.id],
    }),
    category: one(postCategory, {
      fields: [postCategoryToPost.categoryId],
      references: [postCategory.id],
    }),
  }),
)

export const postCategoryRelations = relations(
  postCategory,
  ({ many, one }) => ({
    parentCategory: one(postCategory, {
      fields: [postCategory.parentCategoryId],
      references: [postCategory.id],
      relationName: 'post_category_tree',
    }),
    childCategories: many(postCategory, { relationName: 'post_category_tree' }),
    postLinks: many(postCategoryToPost),
  }),
)
