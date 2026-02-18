# Roadmap 2026 - Blog MVP

Last updated: 2026-02-18
Status: Completed (MVP baseline shipped)
Target: Deliver a production-ready blog and editor workflow managed from admin.

## Objective

Ship an end-to-end blog system where admin users can create, edit, preview,
publish, and unpublish posts, and public users can discover and read published
posts with safe rendering, performance discipline, and operational visibility.

## Scope

### In Scope (MVP)

- Admin post management (`/admin/content/posts`).
- Rich text editor workflow with metadata management.
- Draft and publish lifecycle.
- Public blog listing and post detail rendering.
- Slug uniqueness and publish-state safeguards.
- Search-ready content text derivation.
- Structured mutation logging and failure-safe error handling.
- Tests for critical post lifecycle contracts.

### Out of Scope (Post-MVP)

- Multi-author editorial workflows.
- Scheduled publishing.
- Commenting.
- Advanced media library UX.
- Personalization/recommendation systems.

## Current Baseline

Completed:

- Stable auth/users/contact/email feature foundations.
- Shared infrastructure in `src/lib/*` (db/env/errors/rateLimit/observability).
- Blog feature module, server contracts, and route integrations.
- ProseKit editor integration for admin authoring.
- Public blog rendering and metadata shaping.
- Focused tests for blog lifecycle contracts.
- ADR baseline through `0023`.

## Milestones

## M1 - Data and Domain Contract

Status: Completed

Deliverables:

1. Validate `src/lib/db/schema/blog/*` against required post lifecycle fields.
2. Ensure publish-state semantics are explicit (`draft`, `published`, `archived` where needed).
3. Confirm unique constraints and indexes for slug and publish lookups.
4. Add migration only if schema changes are required.

Exit criteria:

- Schema supports admin editor + public rendering without ad-hoc route logic.

## M2 - Server-Side Blog Feature Layer

Status: Completed

Deliverables:

1. Introduce/complete blog feature module under `src/features` if missing.
2. Implement canonical server functions:
   - list posts (admin and public variants)
   - get post by id/slug
   - create post
   - update post
   - publish post
   - unpublish/archive post
3. Enforce Zod validation and role checks on all mutations.
4. Return `ServerResult<T>` for business failures.
5. Add structured mutation logs.

Exit criteria:

- Routes consume typed blog feature functions instead of embedding lifecycle logic.

## M3 - Admin Editor UX

Status: Completed

Deliverables:

1. Finish post list UX with status filters, search, pagination, and clear actions.
2. Complete new/edit flows with metadata inputs, slug controls, and status actions.
3. Support preview-safe rendering path from stored rich text.
4. Ensure reliable validation feedback and disabled/loading states.

Exit criteria:

- Admin can run full authoring flow without raw DB intervention.

## M4 - Public Blog Experience

Status: Completed

Deliverables:

1. Public list route only exposes published content.
2. Public detail route resolves by slug and returns notFound for invalid/unpublished posts.
3. Render content safely and consistently with design tokens.
4. Add metadata shaping for SEO basics (title/description/open graph where applicable).

Exit criteria:

- Public blog is safe, readable, and production-appropriate.

## M5 - Quality and Security Gate

Status: Completed

Deliverables:

1. Tests for post lifecycle and route protection contracts.
2. Lint/type/test/build green for changed scope.
3. Verify no secret logging and no unsafe HTML rendering.
4. Verify rate limit posture for public write paths remains intact.

Exit criteria:

- Blog MVP passes technical quality gates and security baseline.

## M6 - Operational Readiness

Status: Completed

Deliverables:

1. Update references and ADR if architectural decisions change.
2. Update admin docs surface for blog workflow where applicable.
3. Publish deployment checklist for first blog rollout.

Exit criteria:

- Team can operate and evolve blog system without undocumented behavior.

## Dependencies

- ADR contracts: `0004`, `0010`, `0012`, `0013`, `0014`, `0017`, `0020`.
- Core infra: `src/lib/db`, `src/lib/errors`, `src/lib/observability`, `src/lib/search`.
- Existing route scaffold under `src/routes/admin/content/posts/*` and `src/routes/_public/blog/*`.

## Risks and Mitigations

1. Risk: Route-specific blog logic drifts from feature module conventions.
Mitigation: centralize in feature server layer before expanding UI behavior.

2. Risk: Rich text rendering safety regressions.
Mitigation: enforce safe renderer path and explicitly ban raw HTML injection.

3. Risk: Slug collisions or invalid slug updates.
Mitigation: schema constraints + deterministic slug normalization + conflict mapping.

4. Risk: Scope creep into CMS-wide tooling.
Mitigation: lock MVP cutline to blog post lifecycle only.

## Success Criteria

- Admin authoring workflow is complete and reliable.
- Public blog routes are fully functional and safe.
- Blog logic follows Nu Graphix feature/module contracts.
- Documentation, tests, and operational runbook are updated alongside implementation.

## Next Step

Phase-04 remains the active governance layer for security hardening and ongoing
quality enforcement during post-MVP expansion.
