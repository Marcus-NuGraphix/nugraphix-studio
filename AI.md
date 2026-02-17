# Nu Graphix Studio — AI Operating Contract

## Read-first documents

Before making changes, review:

- `ARCHITECTURE.md` (architecture reference + current patterns)
- `docs/adr/*` (Architecture Decision Records — authoritative)
- `docs/plans/NU_GRAPHIX_STUDIO_MASTER_PLAN_V1.md`
- `docs/phases/*` (phase documentation)

## Skill packs

This repo includes additional skill packs under `.agents/skills/`.
Agents should consult these for best-practice guidance where relevant, but must follow Nu Graphix standards in:

- `ARCHITECTURE.md`
- `docs/adr/*`
- `docs/agent/*`
- `docs/phases/*`

## Non-negotiable rules

- Use TanStack Start server functions for backend logic.
- Validate all mutation inputs with Zod (`.validator(schema)` on every POST server function).
- Enforce auth/roles server-side (Better Auth + `requireUserFromHeaders()`).
- Follow `ServerResult<T>` contract for all server functions.
- Throw `notFound()` and `redirect()` — do not wrap them in ServerResult.
- Re-throw `instanceof Response` in catch blocks before converting to ServerFail.
- Do not refactor unrelated code.
- Do not introduce new libraries unless explicitly requested.
- Do not change shadcn/ui tokens or theme unless explicitly requested.
- Never log secrets, tokens, passwords, raw content_json.

## Server function pattern

```ts
export const featureVerbNounFn = createServerFn({ method: 'POST' })
  .validator(zodSchema)
  .handler(async ({ data }): Promise<ServerResult<T>> => {
    try {
      const headers = getRequestHeaders()
      const user = await requireUserFromHeaders(headers)
      // ... business logic
      return ok(result)
    } catch (err) {
      if (err instanceof Response) throw err
      return toServerFail(err)
    }
  })
```

## Output format

When asked to implement changes:

- Provide only the changed files, or a patch/diff (as requested).
- Do not modify files outside the scope list.
