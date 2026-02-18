# Blog Editor MVP Contract

Last updated: 2026-02-18
Status: Completed

## Goal

Implement a production-ready editorial workflow where admin users manage posts
from `/admin/content/posts/*` and public readers consume published output from
`/_public/blog/*`.

## Current Route Baseline

### Admin (implemented)

- `src/routes/admin/content/posts/index.tsx`
- `src/routes/admin/content/posts/new.tsx`
- `src/routes/admin/content/posts/$id.tsx`

### Public (implemented)

- `src/routes/_public/blog/index.tsx`
- `src/routes/_public/blog/$slug.tsx`

## Required Implementation Contracts

### Data

- Blog schema under `src/lib/db/schema/blog/*` must support:
  - draft/published lifecycle
  - slug uniqueness
  - structured editor payload storage and content text extraction
  - author/editor metadata where needed

Implementation note:

- ProseKit document JSON is serialized into `post.content`.
- Search/preview text is derived from ProseKit JSON in feature model utilities.

### Server layer

- Blog server functions must follow ADR `0010` patterns:
  - validator-first (`Zod`)
  - auth/role checks for admin mutations
  - `ServerResult<T>` failures for business errors
  - rethrow framework control responses in catch blocks

### Admin UX

- Post list with status filters and search.
- New/edit forms with robust validation feedback.
- Publish/unpublish controls.
- Safe preview path.
- ProseKit rich-text editor mounted via `src/features/blog/ui/admin/prosekit-editor.tsx`.

### Public UX

- Listing only published posts.
- Slug detail route with `notFound` behavior for invalid/unpublished posts.
- Safe content rendering (no raw HTML injection).

### Ops and quality

- Structured mutation logs for lifecycle actions.
- Tests for create/update/publish/unpublish + route behavior.
- Build/lint/type/test gates pass.

## Editor Stack

- Package: `prosekit`
- Docs reference: `https://prosekit.dev/getting-started/introduction/`
- Core usage:
  - `defineBasicExtension` for baseline editor behavior.
  - `createEditor` for editor instance lifecycle.
  - `editor.getDocJSON()` and `editor.setContent(...)` for controlled form state.

## Definition of Done

1. Admin can create, edit, publish, and unpublish posts.
2. Public routes reflect publish state correctly.
3. Contracts align with ADR `0004`, `0010`, `0012`, `0014`, `0017`, `0020`.
4. Roadmap and phase docs updated with completion status.
