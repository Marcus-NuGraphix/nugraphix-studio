# Skill 03 — Server Functions Standard (TanStack Start)

## Location

- Feature server functions live in:
  - `src/features/<feature>/server/<feature>.queries.ts`
  - `src/features/<feature>/server/<feature>.mutations.ts`

## Naming

- Suffix all server functions with `Fn`:
  - `cmsListPostsFn`, `kbCreateEntryFn`

## Contract (required)

Every server function returns:

- `{ ok: true, data }` OR `{ ok: false, error }`

Standard error codes:

- UNAUTHORIZED, FORBIDDEN, NOT_FOUND, VALIDATION_ERROR, CONFLICT, RATE_LIMITED, INTERNAL

## Throwing rules

Throw ONLY for:

- redirect / notFound
- catastrophic invariants

Return `{ ok:false }` for expected failures.
