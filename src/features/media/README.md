# Media Feature

This feature owns file uploads, media metadata persistence, and admin media
library operations for Nu Graphix Studio.

## Responsibilities

1. Accept admin uploads for blog images and press-release PDFs.
2. Persist metadata in `media_asset` and expose admin listing/detail reads.
3. Provide admin update/delete actions for asset metadata and lifecycle.
4. Provide reusable preview primitives for image/document/audio/video assets.

## `src/lib` Integration

Media uses shared infrastructure directly:

1. `@/lib/db` + `@/lib/db/schema` for Drizzle data access.
2. `@/lib/env/server` for storage configuration.
3. `@/lib/errors` for `ServerResult` mutation contracts.
4. `@/lib/observability` for structured mutation logging.
5. `@/lib/search` for normalized search query behavior.
6. `@/lib/utils` for clipboard/native-share helpers in preview UX.

## Feature Surfaces

1. `model/*`: type contracts, filter schema, formatting helpers.
2. `schemas/*`: metadata and upload payload validation.
3. `server/repository.ts`: Drizzle-backed media query/mutation layer.
4. `server/assets.ts`: admin list/detail/update/delete server functions.
5. `server/uploads.ts`: admin upload server functions.
6. `server/s3.server.ts`: object storage upload/delete adapter.
7. `ui/admin/*`: filters, upload control, table/grid views, preview dialog.
8. `ui/document/*`: PDF toolbar + inline viewer primitives.

## Route Integration

1. `src/routes/admin/media/index.tsx` - media library management surface.
2. `src/routes/admin/media/$assetId.tsx` - metadata edit/detail surface.
3. Admin navigation includes Media under the Content group.
4. Content hub links to media library for editorial workflows.

## Operational Rules

1. All route-facing media server functions enforce admin session checks.
2. Upload payloads are validated with strict MIME allowlists.
3. Size limits are enforced both client-side and server-side.
4. Delete attempts storage cleanup before DB row removal.
5. Server mutation outcomes are structured and logged.

## Current Scope Notes

1. Uploads currently support images and PDFs only.
2. Image width/height extraction is not yet computed server-side.
3. Asset-role linkage to posts/press relations is out of scope for this pass.
