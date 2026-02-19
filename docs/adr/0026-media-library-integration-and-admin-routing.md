# ADR-0026: Media Library Integration and Admin Route Contract

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0010, ADR-0012, ADR-0018, ADR-0020, ADR-0023

## Context

`src/features/media` was introduced from an external scaffold and did not align
with current Nu Graphix Studio contracts.

Key mismatches:

1. Legacy import paths (`@/db`, legacy `components/ui/base/*`) not used by this
   repository.
2. Route assumptions referenced `/dashboard/*` while the admin surface is under
   `/admin/*`.
3. Media UI components were not aligned with the shared composition layer and
   design token usage.
4. Server-layer patterns did not consistently use shared error/observability
   contracts.

Without correction, media could not be safely integrated into production admin
workflows.

## Decision

Adopt a repo-native media architecture under `src/features/media` and expose it
through dedicated admin routes.

1. **Feature contract alignment**
   - Rebuild media server/client/model/UI surfaces to use shared imports from
     `@/lib`, `@/components`, and `@/hooks`.
   - Keep media boundaries inside `src/features/media` per feature-module rules.

2. **Admin route integration**
   - Add `/admin/media` (`src/routes/admin/media/index.tsx`) for library
     operations.
   - Add `/admin/media/$assetId` (`src/routes/admin/media/$assetId.tsx`) for
     metadata lifecycle and deletion.
   - Integrate media route into admin navigation, quick access, and breadcrumb
     mapping.

3. **Server contract standardization**
   - Enforce admin checks on all route-facing media mutations/queries.
   - Use shared `ServerResult` contract for mutation outcomes.
   - Emit structured mutation logs via `@/lib/observability`.

4. **Storage lifecycle hardening**
   - Keep S3 upload adapter in feature scope (`server/s3.server.ts`) using
     `@/lib/env/server` configuration.
   - Attempt object-storage deletion during asset delete operations before DB
     row removal.

5. **UI/system alignment**
   - Rewrite admin media UI to use shared shadcn/component primitives and token
     classes only.
   - Support responsive preview behavior using shared hook contracts.

## Consequences

### Positive

1. Media is now a first-class admin capability and consistent with route/module
   architecture.
2. Editorial workflows can reuse a centralized media surface from admin content
   operations.
3. Error handling and logs are predictable across media mutation paths.
4. The feature now follows existing component/token standards and avoids legacy
   styling APIs.

### Trade-offs

1. Media upload scope remains intentionally narrow (images + PDF) until future
   expansion.
2. Delete flow now depends on object storage availability for best-effort
   cleanup logging.

## References

- Feature readme: `src/features/media/README.md`
- Admin routes:
  - `src/routes/admin/media/index.tsx`
  - `src/routes/admin/media/$assetId.tsx`
- Navigation integration: `src/components/navigation/admin/navigation.ts`
- Route surface map: `docs/reference/routing-surface-map.md`
- Feature contract reference: `docs/reference/feature-media.md`
