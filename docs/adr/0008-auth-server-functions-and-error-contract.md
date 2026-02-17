# ADR 0008 — Auth Integration, Server Function Pattern & Unified Error Contract

**Status:** Accepted (Amended — see ADR-0009, ADR-0010)
**Date:** 2026-02-17
**Supersedes:** None
**Related ADRs:**

- 0001 Project Foundation
- 0002 Database & ORM Strategy
- 0003 Authentication & Authorization
- 0007 Drizzle + Neon Integration

---

## Context

Nu Graphix Studio has now integrated:

- **Neon Postgres** (AWS AP Southeast 1 – Singapore)
- **Drizzle ORM**
- **Better Auth**
- **TanStack Start Server Functions**
- A standardized **ServerResult<T> contract**

This marks the transition from planning to a functioning full-stack foundation.

We needed to formalize:

1. How authentication integrates with TanStack Start.
2. How server functions return data.
3. How errors are handled consistently.
4. How database schema is modularized.
5. How single-region infrastructure is defined.

---

## Decision

### 1️⃣ Database Strategy (Confirmed)

- Provider: **Neon Postgres**
- Region: **AWS Asia Pacific (Singapore)**
- Architecture: **Single-region only**
- ORM: **Drizzle**
- Driver: `@neondatabase/serverless`
- Migration tool: `drizzle-kit`

Schema structure:

```
src/lib/db/
  client.ts
  schema.ts
  schema/
    index.ts
    auth/
      index.ts
      auth.ts
```

Bounded context modular schema exports are enforced via:

```ts
// src/lib/db/schema.ts
export * from './schema/index'
```

Drizzle config:

```ts
schema: './src/lib/db/schema/**/index.ts'
```

This allows domain expansion without breaking imports.

---

### 2️⃣ Authentication Strategy

- Auth Provider: **Better Auth**
- Strategy: **Email + Password only (v1)**
- OAuth deferred to future phase
- Auth schema generated via Better Auth CLI
- Schema stored in:

  ```
  src/lib/db/schema/auth/auth.ts
  ```

Auth config lives in:

```
src/lib/auth/auth.ts
```

Auth is operational and Neon reflects generated tables.

---

### 3️⃣ Middleware Strategy (Deferred)

TanStack + Better Auth supports middleware integration.

Decision:

- ❌ Do NOT implement middleware yet.
- ✅ Enforce authorization at **server function level**.
- Middleware can be introduced later if needed for route-level enforcement.

Rationale:

- Reduces early complexity.
- Keeps control explicit and localized.
- Aligns with Nu Graphix principle: enforce permissions server-side in mutations.

---

### 4️⃣ Server Function Contract (Critical)

All server functions must return a standardized result:

```ts
export type ServerErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL'

export type ServerFail = {
  ok: false
  error: {
    code: ServerErrorCode
    message: string
    fieldErrors?: Record<string, Array<string>>
  }
}

export type ServerOk<T> = { ok: true; data: T }

export type ServerResult<T> = ServerOk<T> | ServerFail
```

Helper utilities:

```ts
export const ok = <T>(data: T): ServerOk<T>
export const fail = (...)
```

### Contract Rules

- Expected failures → return `{ ok: false }`
- Unexpected failures → throw
- UI must branch on `ok`
- Never return raw DB errors
- Never leak stack traces

---

### 5️⃣ TanStack Start Server Function Pattern

Correct usage requires:

- No destructuring `request` from context
- No usage of non-existent helpers like `getHeaders`
- Use context provided by `createServerFn`

Server functions live in:

```
src/features/<feature>/server/
```

Naming convention:

- Queries: `<feature><Verb>NounFn`
- Mutations: `<feature><Verb>NounFn`
- Always suffixed with `Fn`

Example:

```
authGetSessionFn
cmsCreatePostFn
kbListEntriesFn
```

---

### 6️⃣ ESLint Strict Type Enforcement

The project enforces:

- `Array<string>` instead of `string[]`
- Strict TypeScript mode
- No implicit `any`
- No unnecessary optional chaining
- No unused locals

This was validated during CI stabilization.

---

### 7️⃣ CI & Quality Baseline (Stabilized)

GitHub Actions now runs:

- Install
- Lint
- Typecheck
- Test (non-failing with no tests)
- Build

The project now builds cleanly in CI.

---

## Consequences

### Positive

- Clean modular DB structure
- Typed server contract
- Strict lint baseline
- Neon working with migrations
- Auth fully integrated
- Predictable server function pattern
- Ready for feature development

### Trade-offs

- Middleware not yet used
- Single region introduces latency trade-offs
- OAuth deferred
- RLS not yet enforced (future ADR)

---

## Architecture Snapshot (Current State)

Frontend:

- TanStack Start
- shadcn/ui
- Tailwind v4
- React 19

Backend:

- TanStack Server Functions
- Better Auth
- Drizzle ORM
- Neon Postgres

Infra:

- Single-region Neon
- GitHub CI
- Vite + Nitro SSR

---

## Future Considerations

- Introduce RLS policies once multi-tenant
- Add OAuth providers
- Add middleware-based route guards
- Introduce audit logging
- Add rate limiting per server function
- Add OpenTelemetry integration

---

## Amendments (2026-02-17)

This ADR remains the source of truth for the ServerResult contract, auth config, and DB strategy. The following refinements have been captured in subsequent ADRs:

- **ADR-0009** — Route protection via `beforeLoad` + pathless layout routes (replaces "middleware deferred" with a concrete `_authenticated.tsx` pattern)
- **ADR-0010** — Canonical server function patterns including `.validator()` chains, `notFound()`/`redirect()` throw semantics, and error catch guards

Key corrections applied:
1. `notFound()` and `redirect()` must be **thrown**, not wrapped in `ServerResult`
2. `.validator(zodSchema)` is **required** on all mutations
3. `catch` blocks must re-throw `instanceof Response` before converting to `ServerResult`

---

## Final Assessment

The project has now transitioned from planning to:

> A production-grade full-stack foundation with typed DB access, structured auth, consistent error handling, and CI validation.

Nu Graphix Studio is now ready to move into feature construction.

---
