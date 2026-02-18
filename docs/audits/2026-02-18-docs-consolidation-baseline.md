# Baseline Audit Snapshot - Documentation Consolidation

Date: 2026-02-18
Scope: docs governance, ADR indexing, planning surface, root document alignment
Status: Historical snapshot (superseded by production-hardening docs system)

## Summary

Documentation has been consolidated around a stable ADR archive (`0001`-`0022`),
a single active roadmap focused on Blog MVP, and updated agent/audit guidance.

## Findings

### Medium

1. Admin documentation routes still contain placeholder copy and do not yet render live markdown indexes.
- Files:
  - `src/routes/admin/docs/adr/index.tsx`
  - `src/routes/admin/docs/phases/index.tsx`
  - `src/routes/admin/docs/architecture/index.tsx`

2. Blog implementation is route-visible but not yet represented as a dedicated feature module under `src/features`.
- Files:
  - `src/routes/admin/content/posts/index.tsx`
  - `src/routes/admin/content/posts/new.tsx`
  - `src/routes/admin/content/posts/$id.tsx`
  - `src/routes/_public/blog/index.tsx`
  - `src/routes/_public/blog/$slug.tsx`

### Low

1. Legacy documents had stale links to pre-archive ADR paths and old plan files.
- Resolved in this consolidation pass.

## Recommended Next Fix Order

1. Implement Blog MVP plan items in `docs/archive/roadmaps/ROADMAP-2026-BLOG-MVP.md` (historical context only).
2. Replace admin docs route placeholders with generated indexes sourced from docs metadata.
3. Add blog feature reference doc updates after each implementation milestone.

## Verification Commands

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
