# Nu Graphix Studio — AI Operating Contract

## Read-first documents

Before making changes, review:

- `docs/plans/NU_GRAPHIX_STUDIO_MASTER_PLAN_V1.md`
- `docs/phases/phase-03.md` (Engineering System)
- `docs/phases/phase-04.md` (Security & Quality)
- `docs/adr/*` (Architecture Decisions)

## Non-negotiable rules

- Use TanStack Start server functions for backend logic.
- Validate all mutation inputs with Zod.
- Enforce auth/roles server-side (Better Auth utilities).
- Follow ServerResult contract for all server functions.
- Do not refactor unrelated code.
- Do not introduce new libraries unless explicitly requested.
- Do not change shadcn/ui tokens or theme unless explicitly requested.
- Never log secrets, tokens, passwords, raw content_json.

## Output format

When asked to implement changes:

- Provide only the changed files, or a patch/diff (as requested).
- Do not modify files outside the scope list.
