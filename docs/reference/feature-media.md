# `src/features/media` Reference

Last updated: 2026-02-18

## Purpose

`media` provides a reusable asset library for admin workflows in Nu Graphix
Studio. It centralizes uploads, metadata persistence, preview behavior, and
admin lifecycle controls.

## Scope

1. Admin uploads for blog images and press-release PDFs.
2. Metadata persistence to `media_asset`.
3. Admin listing/filtering/pagination/search.
4. Admin metadata update and delete operations.
5. Asset preview UX for image/document/video/audio/other types.

## Key Modules

- `src/features/media/server/repository.ts`
- `src/features/media/server/assets.ts`
- `src/features/media/server/uploads.ts`
- `src/features/media/server/s3.server.ts`
- `src/features/media/model/filters.ts`
- `src/features/media/schemas/asset.ts`
- `src/features/media/schemas/upload.ts`

## Route Integration

- Library: `src/routes/admin/media/index.tsx`
- Asset detail: `src/routes/admin/media/$assetId.tsx`
- Admin nav + breadcrumbs: `src/components/navigation/admin/navigation.ts`
- Content hub link: `src/routes/admin/content/index.tsx`

## Shared Layer Dependencies

1. `@/lib/db` + `@/lib/db/schema` for persistence.
2. `@/lib/errors` for safe `ServerResult` mutation contracts.
3. `@/lib/observability` for structured mutation logging.
4. `@/lib/search` for normalized query filtering behavior.
5. `@/lib/env/server` for storage config.
6. `@/hooks/use-mobile` for adaptive preview dialog/drawer UX.

## Operational Rules

1. Media server functions are admin-only and route-facing.
2. Upload validation enforces MIME and size limits.
3. Delete attempts object-storage cleanup before row removal.
4. UI uses shared component primitives/tokens (`src/components/ui`).
5. Media route search state is schema-validated via `mediaAssetFiltersSchema`.
