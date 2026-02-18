# Phase 03 - Engineering System

Status: Active
Last updated: 2026-02-18

## Objective

Execute Blog MVP implementation using established feature-module and server
contract standards.

## Current Workstream

- Active roadmap: `docs/plans/ROADMAP-2026-BLOG-MVP.md`

## Execution Checklist

### Module and Data Contracts

- [ ] Confirm blog schema supports authoring + publish lifecycle.
- [ ] Add migration only if schema gap is identified.
- [ ] Keep schema exports stable via `src/lib/db/schema/index.ts`.

### Server Layer

- [ ] Ensure blog server functions follow canonical pattern:
  - Zod validator
  - auth/role checks
  - `ServerResult<T>` contract
  - control-signal rethrow in catch blocks
- [ ] Centralize blog lifecycle logic in feature server modules.
- [ ] Add structured mutation logs for create/update/publish actions.

### Admin UI

- [ ] Complete posts index filtering/search/status controls.
- [ ] Complete new/edit/post detail forms with robust feedback states.
- [ ] Support safe preview and explicit publish actions.

### Public UI

- [ ] List route only returns published content.
- [ ] Slug route handles missing/unpublished content with `notFound` behavior.
- [ ] Render content safely and consistently.

### Verification

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test` (targeted + relevant suites)
- [ ] `pnpm build`

## Exit Criteria

Blog/editor workflow is fully operational end-to-end and implemented within
feature-first architecture boundaries.
