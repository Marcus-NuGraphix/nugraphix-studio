# Incident and Debug Protocol

Last updated: 2026-02-18
Status: Active

## Scope

Operational contract for incident triage and debugging during Blog MVP
expansion.

## Severity Model

1. `S1`: Critical production impact (auth down, outage, data-risk event).
2. `S2`: Major feature failure (publish pipeline blocked, contact/email major break).
3. `S3`: Minor regression (non-blocking UX or local defect).

## Required Execution Order

1. Inspect structured logs first.
2. Form top suspects from evidence.
3. Apply one minimal fix only.
4. Re-verify (`lint`, `typecheck`, `test`, `build`) before additional rewrites.

## 3-Failure Escalation Rule

When the same incident key fails 3 consecutive times:

1. Emit escalation event (`status: investigating`).
2. Stop broad refactors.
3. Move to targeted diagnosis and rollback assessment.
4. Add prevention update to `docs/ai-mistakes.md` if repeated pattern is confirmed.

Implementation primitives:

- `src/lib/observability/incident-log.ts`
- `src/lib/observability/failure-escalation.ts`

## Blog Publish-Flow Contract

Incident identity for publish-state failures:

1. `incidentKey`: `blog.publish-flow`
2. `category`: `publish-flow`
3. `severity`: `S2`

Instrumentation path:

- `src/features/blog/server/posts.ts` (`publishBlogPostFn`, `unpublishBlogPostFn`)

## Rollback Path (Schema or Publish-State Regression)

1. Halt additional migration or lifecycle changes.
2. Identify latest known-good commit/tag.
3. Revert publish-state mutation path first, then schema changes if required.
4. Re-run release smoke checks from `docs/phases/phase-06.md`.
5. Publish incident summary with root cause and prevention rule.

