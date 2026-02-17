# Nu Graphix Studio — Architectural Audit

**Date:** 2026-02-17
**Scope:** Structural validation and gap analysis
**Last updated:** 2026-02-17

---

## Resolved (Previously Identified)

| # | Item | Resolution |
|---|------|-----------|
| 1 | No GitHub Actions CI workflow | Created — runs typecheck, lint, build, test on push |
| 2 | No `src/lib/` implementation files | Implemented — auth, db, errors all populated |
| 3 | No `src/features/` directories | Created — `features/auth/server/` with server functions |
| 4 | Core backend dependencies not installed | Installed — drizzle-orm, better-auth, zod, @neondatabase/serverless |
| 5 | No `drizzle.config.ts` | Created — aligned with ADR-0002 |
| 6 | Starter template logos in `public/` | Replaced with Nu Graphix branding |
| 7 | README was boilerplate | Rewritten for Nu Graphix Studio |

---

## Outstanding Items

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 1 | No `beforeLoad` auth guard on `/admin` routes | Critical | Pattern defined in ADR-0009, not yet implemented |
| 2 | No login route wired up | Critical | `_auth/login/index.tsx` exists but needs implementation |
| 3 | `as any` casts in `authGetSessionFn` | Medium | Better Auth session types should flow through properly |
| 4 | No `og-image.png` | Low | Referenced in brand config, file does not exist |
| 5 | No `docs/ai-mistakes.md` | Low | Phase 05 mandates this file |
| 6 | Starter component examples still in source | Low | `component-example.tsx`, `example.tsx` in components |
| 7 | `src/logo.svg` is TanStack starter asset | Low | Should be removed or replaced |
| 8 | No test files exist yet | Low | Vitest configured, no tests written |

---

## Security Observations

| # | Observation | Status |
|---|------------|--------|
| 1 | Auth rules consistent across all docs | Clean |
| 2 | ServerResult contract enforced — no raw DB errors leak | Clean |
| 3 | Rate limiting not yet implemented | Deferred (acceptable for admin-only) |
| 4 | CSP headers not configured | Deferred to production hardening |
| 5 | No env validation library | Consider `@t3-oss/env-core` before production |

---

## Architecture Validation (2026-02-17)

Validated against TanStack Start documentation and Better Auth integration docs:

- Better Auth config with `tanstackStartCookies()` — correct
- API catch-all handler at `/api/auth/$` — correct
- `getRequestHeaders()` usage — correct
- `ServerResult<T>` error contract — clean
- Route structure with pathless layouts (`_public`, `_auth`, `_legal`) — correct
- Middleware deferral — valid for current scope

Corrections captured in:
- ADR-0009 (route protection patterns)
- ADR-0010 (server function canonical patterns)

---
