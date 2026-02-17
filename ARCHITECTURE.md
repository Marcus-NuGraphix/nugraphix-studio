# Nu Graphix Studio — Architecture Reference

> Last validated: 2026-02-17

---

## Overview

Full-stack TanStack Start application serving as:

1. Public marketing site (consultancy storefront)
2. Internal admin system (CMS + Knowledge Base)
3. Future foundation for vertical SaaS products

Single developer, production-intended, strict architectural discipline.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | TanStack Start (React 19, Vite, Nitro SSR) |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS v4 + shadcn/ui + CVA |
| Database | Neon Postgres (Singapore region) |
| ORM | Drizzle (neon-http driver) |
| Auth | Better Auth (email/password) |
| Validation | Zod |
| CI | GitHub Actions (lint, typecheck, test, build) |

---

## Project Structure

```
src/
  routes/                        # File-based routing
    __root.tsx                   # HTML shell, global providers
    _public/                     # Public marketing routes (pathless layout)
      route.tsx                  # Layout wrapper
      index.tsx                  # / — home page
      blog/index.tsx
      contact/index.tsx
      portfolio/index.tsx
    _auth/                       # Auth flow routes (pathless layout)
      route.tsx                  # Layout wrapper
      login/index.tsx
      signup/index.tsx
      forgot-password/index.tsx
      reset-password/index.tsx
    _legal/                      # Legal pages (pathless layout)
      route.tsx                  # Layout wrapper
      privacy-policy/index.tsx
    admin/                       # Protected admin routes
      route.tsx                  # Layout + beforeLoad auth guard
      index.tsx                  # /admin
      dashboard/index.tsx        # /admin/dashboard
    api/
      auth/$.ts                  # Better Auth catch-all handler

  features/                      # Feature-organized business logic
    <feature>/
      server/
        <domain>.queries.ts      # GET server functions
        <domain>.mutations.ts    # POST server functions
      schemas/                   # Shared Zod schemas (if needed)
      components/                # Feature-specific UI (optional)

  lib/                           # Core infrastructure
    auth/
      auth.ts                    # Better Auth configuration
      session.ts                 # Session helpers (getSessionFromHeaders, requireUserFromHeaders)
    db/
      client.ts                  # Neon HTTP + Drizzle client
      schema.ts                  # Barrel export
      schema/
        <domain>/
          index.ts               # Domain barrel export
          <domain>.ts            # Drizzle table definitions
    errors/
      serverResult.ts            # ServerResult<T> type + ok/fail helpers
      AppError.ts                # Typed application error class
      toServerFail.ts            # Error → ServerFail converter

  components/
    ui/                          # shadcn/ui components
    theme/                       # Theme system (SSR-safe, cookie-based)
      constants.ts               # Cookie name, max-age, media query
      theme-script.ts            # Blocking inline script (prevents FOWT)
      theme-provider.tsx         # React context provider
      use-theme.ts               # Consumer hook
      theme-toggle.tsx           # UI toggle (shadcn dropdown)
    brand/                       # Brand components (logo, wordmark)

docs/
  adr/                           # Architecture Decision Records
```

---

## Routing Architecture

TanStack Router pathless layout routes (`_prefix`) group routes under shared layouts and guards without affecting URLs:

| Layout | URL prefix | Purpose |
|--------|-----------|---------|
| `_public` | `/` | Marketing pages, public content |
| `_auth` | `/login`, `/signup`, etc. | Auth flows (centered layout) |
| `_legal` | `/privacy-policy`, etc. | Legal pages |
| `admin` | `/admin/*` | Protected admin area |

The `/admin` layout route should include a `beforeLoad` guard that redirects unauthenticated users to `/login`. See ADR-0009.

---

## Server Function Contract

All server functions return `ServerResult<T>`:

```ts
type ServerResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: ServerErrorCode; message: string; fieldErrors?: Record<string, Array<string>> } }
```

**Error codes:** `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL`

**Framework signals are thrown, not wrapped:**
- `throw notFound()` — handled by router's `notFoundComponent`
- `throw redirect({ to: '/login' })` — handled by router navigation

**Catch blocks must re-throw framework signals:**
```ts
catch (err) {
  if (err instanceof Response) throw err
  return toServerFail(err)
}
```

See ADR-0010 for canonical patterns.

---

## Server Function Naming

| Type | Pattern | Example |
|------|---------|---------|
| Query | `<feature><Verb><Noun>Fn` | `kbListEntriesFn` |
| Mutation | `<feature><Verb><Noun>Fn` | `cmsCreatePostFn` |
| Schema | `<verb><Noun>Schema` | `createPostSchema` |
| DTO | `<Noun>DTO` | `PostDTO` |

---

## Authentication Flow

1. Better Auth config at [auth.ts](src/lib/auth/auth.ts) with `tanstackStartCookies()` plugin
2. API handler at [$.ts](src/routes/api/auth/$.ts) — catch-all for `/api/auth/*`
3. Client-side auth via Better Auth client SDK (recommended by docs)
4. Server-side session via `getRequestHeaders()` + `auth.api.getSession({ headers })`
5. Route protection via `beforeLoad` on admin layout route
6. Server function auth via `requireUserFromHeaders(headers)`

Defense-in-depth: routes guard navigation, server functions guard data.

---

## Database Strategy

- Single region: AWS Asia Pacific (Singapore)
- Driver: `@neondatabase/serverless` (HTTP mode for serverless)
- Schema modularized by domain under `src/lib/db/schema/<domain>/`
- Drizzle Kit discovers schemas via glob: `**/index.ts`
- Migrations output to `./drizzle/`

---

## Theme System

Cookie-based dark mode with SSR flash prevention:

1. **Blocking `<script>` in `<head>`** reads `ui-theme` cookie and applies `dark`/`light` class to `<html>` before first paint
2. **`suppressHydrationWarning`** on `<html>` prevents React warnings from the script's class modification
3. **`ThemeProvider`** syncs React state from cookie — exposes `theme`, `resolvedTheme`, `setTheme`
4. **`useTheme()`** hook for components — `resolvedTheme` is always `'dark'` or `'light'` (never `'system'`)
5. **System preference listener** tracks OS changes in real-time when in system mode

CSS uses Tailwind v4 class-based dark mode: `@custom-variant dark (&:is(.dark *))`.

See ADR-0011.

---

## ADR Index

| # | Title | Status |
|---|-------|--------|
| 0001 | Project Foundation | Accepted |
| 0002 | Database & ORM Strategy | Accepted |
| 0003 | Authentication & Authorization | Accepted |
| 0004 | Content Model & Rich Text | Accepted (deferred) |
| 0005 | Observability & Logging | Accepted (deferred) |
| 0006 | Brand System & Component Architecture | Accepted |
| 0007 | Drizzle + Neon Integration | Accepted |
| 0008 | Auth, Server Functions & Error Contract | Accepted (amended) |
| 0009 | Route Protection & Redirect Strategy | Accepted |
| 0010 | Server Function Canonical Patterns | Accepted |
| 0011 | Theme System & Dark Mode (SSR-Safe) | Accepted |

---

## Pre-Feature Checklist

Before building CMS/KB features, complete:

- [ ] Add `beforeLoad` auth guard to `admin/route.tsx`
- [ ] Wire up `_auth/route.tsx` layout with centered form layout
- [ ] Implement login page with Better Auth client SDK
- [ ] Type Better Auth session properly (remove `as any` casts)
- [ ] Add `notFoundComponent` to root route
- [ ] Test redirect flow: unauthenticated → login → redirect back
- [ ] Create first admin user via Better Auth API or seed script

---
