import { relations } from 'drizzle-orm'
import { index, pgTable, primaryKey, text } from 'drizzle-orm/pg-core'
import { mediaAsset } from '../media/media-assets'
import { timestampUtc } from '../shared/timestamps'
import { pressRelease } from './press-releases'

export const pressReleaseToMediaAsset = pgTable(
  'press_release_to_media_asset',
  {
    pressReleaseId: text('press_release_id')
      .notNull()
      .references(() => pressRelease.id, { onDelete: 'cascade' }),
    mediaAssetId: text('media_asset_id')
      .notNull()
      .references(() => mediaAsset.id, { onDelete: 'cascade' }),
    role: text('role').default('attachment').notNull(),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
  },
  (table) => [
    primaryKey({
      name: 'press_release_to_media_asset_pk',
      columns: [table.pressReleaseId, table.mediaAssetId],
    }),
    index('press_release_to_media_asset_press_idx').on(table.pressReleaseId),
    index('press_release_to_media_asset_media_idx').on(table.mediaAssetId),
  ],
)

export const pressReleaseToMediaAssetRelations = relations(
  pressReleaseToMediaAsset,
  ({ one }) => ({
    pressRelease: one(pressRelease, {
      fields: [pressReleaseToMediaAsset.pressReleaseId],
      references: [pressRelease.id],
    }),
    mediaAsset: one(mediaAsset, {
      fields: [pressReleaseToMediaAsset.mediaAssetId],
      references: [mediaAsset.id],
    }),
  }),
)


