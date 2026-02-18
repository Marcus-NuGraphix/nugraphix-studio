# Nu Graphix Studio - AI Operating Contract

## Read-first documents

Before making changes, review in this order:

1. `ARCHITECTURE.md`
2. `docs/adr/README.md`
3. `docs/adr/ADR-SUMMARY-0001-0022.md`
4. `docs/plans/ROADMAP-2026-BLOG-MVP.md`
5. `docs/phases/README.md`
6. `docs/agent/README.md`

## Skill packs

This repo includes implementation skill packs under `.agents/skills/`.
Use them where relevant, but local standards in `docs/agent/*`, ADRs, and
`ARCHITECTURE.md` are authoritative.

## Non-negotiable rules

- Use TanStack Start server functions for backend logic.
- Validate all mutation inputs with Zod.
- Enforce auth and role checks server-side.
- Return `ServerResult<T>` for expected business failures.
- Throw framework control signals (`redirect`, `notFound`, `Response`) only.
- Re-throw `instanceof Response` in catch blocks before failure conversion.
- Do not refactor unrelated code.
- Do not introduce new libraries unless explicitly requested.
- Do not log secrets, tokens, passwords, or raw rich-text payloads.

## Server Function Pattern

```ts
export const featureVerbNounFn = createServerFn({ method: 'POST' })
  .validator(zodSchema)
  .handler(async ({ data }): Promise<ServerResult<T>> => {
    try {
      // auth + business logic
      return ok(result)
    } catch (err) {
      if (err instanceof Response) throw err
      return toServerFail(err)
    }
  })
```

## Current Delivery Focus

- Complete the Blog MVP workflow:
  - admin post authoring and publish controls
  - public blog listing and detail rendering
  - production quality gates and docs updates

## Output format

When asked to implement changes:

- Provide scoped patches for requested files.
- Include verification commands run (or explicitly note if not run).
- Update docs when architecture or contracts change.
