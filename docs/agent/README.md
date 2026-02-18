# Nu Graphix Studio Agent Operating System

Last updated: 2026-02-18

This folder defines the execution contract for AI agents working in this repo.

## Mandatory Read Order

1. `AI.md`
2. `ARCHITECTURE.md`
3. `docs/adr/README.md`
4. `docs/adr/ADR-SUMMARY-0001-0022.md`
5. `docs/plans/ROADMAP-2026-BLOG-MVP.md`
6. `docs/phases/README.md`
7. `docs/agent/skills/00-index.md`
8. `docs/audits/repo-audit-order.md`

## Current Delivery Priority

- Primary MVP target: fully functional admin blog/editor workflow with safe
  publish pipeline and public blog rendering.
- Do not regress completed auth, users, contact, and email integrations while
  implementing blog/editor scope.

## Enforcement Rules

- No unrelated edits.
- Follow the feature-module boundaries in `ARCHITECTURE.md` and ADR `0012`.
- Validate mutation inputs with Zod.
- Enforce role checks server-side.
- Return `ServerResult<T>` for expected failures.
- Re-throw framework control signals (`Response`, redirects, notFound).
- Run verification commands before handoff when code changes are made.

## Skill Packs

The repo includes `.agents/skills/*` packs (Context7, Better Auth, Drizzle,
OWASP, shadcn, TanStack). Use them as implementation references.
`docs/agent/skills/*` remains the local source-of-truth for Nu Graphix workflow.

## Documentation Hygiene

When architecture or implementation contracts change in code, update in the same
work item:

1. `docs/adr` (new ADR if architectural)
2. `docs/plans` and `docs/phases` (execution state)
3. `docs/reference` (technical contract updates)
4. Root docs (`README.md`, `ARCHITECTURE.md`, `AI.md`) when surface-level
   guidance changes
