import { relations } from 'drizzle-orm'
import { bigint, index, integer, pgTable, text } from 'drizzle-orm/pg-core'
import { user } from '../auth/auth'
import { mediaAssetType } from '../shared/enums'
import { timestampUtc } from '../shared/timestamps'

export const mediaAsset = pgTable(
  'media_asset',
  {
    id: text('id').primaryKey(),
    key: text('key').notNull().unique(),
    url: text('url').notNull(),
    type: mediaAssetType('type').default('other').notNull(),
    mimeType: text('mime_type').notNull(),
    fileName: text('file_name').notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
    width: integer('width'),
    height: integer('height'),
    durationSeconds: integer('duration_seconds'),
    previewUrl: text('preview_url'),
    thumbnailUrl: text('thumbnail_url'),
    altText: text('alt_text'),
    uploadedById: text('uploaded_by_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('media_asset_type_idx').on(table.type),
    index('media_asset_createdAt_idx').on(table.createdAt),
    index('media_asset_uploadedById_idx').on(table.uploadedById),
    index('media_asset_mimeType_idx').on(table.mimeType),
  ],
)

export const mediaAssetRelations = relations(mediaAsset, ({ one }) => ({
  uploadedBy: one(user, {
    fields: [mediaAsset.uploadedById],
    references: [user.id],
  }),
}))



