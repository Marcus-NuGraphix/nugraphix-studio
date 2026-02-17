import { relations } from 'drizzle-orm'
import { index, pgTable, primaryKey, text } from 'drizzle-orm/pg-core'
import { post } from './posts'
import { postTag } from './post-tags'

export const postTagToPost = pgTable(
  'post_tag_to_post',
  {
    postId: text('post_id')
      .notNull()
      .references(() => post.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => postTag.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.tagId] }),
    index('post_tag_to_post_post_idx').on(table.postId),
    index('post_tag_to_post_tag_idx').on(table.tagId),
  ],
)

export const postTagToPostRelations = relations(postTagToPost, ({ one }) => ({
  post: one(post, {
    fields: [postTagToPost.postId],
    references: [post.id],
  }),
  tag: one(postTag, {
    fields: [postTagToPost.tagId],
    references: [postTag.id],
  }),
}))

export const postTagRelations = relations(postTag, ({ many }) => ({
  postLinks: many(postTagToPost),
}))
