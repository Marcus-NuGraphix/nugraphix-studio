# Nu Graphix Studio — Architecture Reference

> Last validated: 2026-02-18

---

## Overview

Full-stack TanStack Start application serving as:

1. Public marketing site (consultancy storefront)
2. Internal admin system (CMS + Knowledge Base + User Management)
3. Future foundation for vertical SaaS products

Single developer, production-intended, strict architectural discipline.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | TanStack Start (React 19, Vite, Nitro SSR) |
| Routing | TanStack Router (file-based) |
| Data Fetching | TanStack Query (`@tanstack/react-query`) |
| Tables | TanStack Table (headless, per-table devtools) |
| Forms | TanStack Form (with `@tanstack/react-form-start` SSR adapter) |
| Styling | Tailwind CSS v4 + shadcn/ui + CVA |
| Database | Neon Postgres (Singapore region) |
| ORM | Drizzle (neon-http driver) |
| Auth | Better Auth (email/password + admin plugin) |
| Email | Pluggable providers (Resend, SendGrid, noop) |
| Validation | Zod |
| Animation | Framer Motion |
| Toast | Sonner |
| CI | GitHub Actions (lint, typecheck, test, build) |

---

## Project Structure

```
src/
  routes/                        # File-based routing
    __root.tsx                   # HTML shell, global providers, devtools
    _public/                     # Public marketing routes (pathless layout)
      route.tsx                  # Layout wrapper
      index.tsx                  # / — home page
      blog/index.tsx
      contact/index.tsx
      portfolio/index.tsx
    _auth/                       # Auth flow routes (pathless layout)
      route.tsx                  # Centered layout with branding
      login/index.tsx
      signup/index.tsx
      forgot-password/index.tsx
      reset-password/index.tsx
      account/index.tsx          # /account
    _legal/                      # Legal pages (pathless layout)
      route.tsx
      privacy-policy/index.tsx
    admin/                       # Protected admin routes
      route.tsx                  # Layout + beforeLoad auth guard
      index.tsx                  # /admin
      dashboard/index.tsx        # /admin/dashboard
      components/index.tsx       # /admin/components
      components/ui/index.tsx    # /admin/components/ui
      components/navigation/index.tsx  # /admin/components/navigation
      components/marketing/index.tsx   # /admin/components/marketing
      docs/index.tsx             # /admin/docs
      docs/architecture/index.tsx  # /admin/docs/architecture
      docs/adr/index.tsx         # /admin/docs/adr
      docs/phases/index.tsx      # /admin/docs/phases
      account/index.tsx          # /admin/account
      users/index.tsx            # /admin/users
      users/$userId.tsx          # /admin/users/:userId
    api/
      auth/$.ts                  # Better Auth catch-all handler

  features/                      # Feature-organized business logic
    auth/                        # Authentication & authorization
      index.ts                   # Barrel export
      client/auth-client.ts      # Better Auth browser client
      model/                     # Domain types & logic
        permissions.ts           # Role → permission mapping
        redirect.ts              # Safe redirect URL validation
        safe-errors.ts           # Error sanitization for UI
        session.ts               # AppSession, UserRole types
      schemas/                   # Zod validation schemas
        auth.ts                  # Login, signup, reset schemas
        password.ts              # Password policy schema
      server/                    # Server-only modules
        admin-api.ts             # Admin plugin endpoint wrappers
        auth-config.ts           # Pure auth config + reset-link shaping
        auth.ts                  # Better Auth config (plugins, hooks)
        authorize.ts             # Permission enforcement
        request-context.ts       # IP/user-agent + auth rate-limit key helpers
        rate-limit.ts            # Auth rate-limit wrapper
        security.ts              # Password change, session mgmt
        session.server.ts        # getOptionalSession, requireSession, requireAdmin
        session.ts               # Server functions wrapping session.server
      tests/                     # Vitest test files (10 test suites)
      ui/                        # Auth UI components
        auth-form-card.tsx       # Shared form card with brand panel
        login-form.tsx
        signup-form.tsx
        forgot-password-form.tsx
        reset-password-form.tsx
    contact/                     # Contact form & lead management
      client/contact.ts
      hooks/use-contact-form.ts
      model/                     # Filters, types, lead form model
      server/                    # reCAPTCHA, repository, admin queries
    email/                       # Email infrastructure
      client/email.ts
      model/types.ts
      schemas/                   # Admin, contact, preferences, webhooks
      server/                    # Provider registry, send, templates, workflows
      tests/
      ui/
        account/                 # User-facing email preferences
        admin/                   # Admin email dashboard components
        public/                  # Public subscription card
    users/                       # User account + admin governance
      model/                     # Filters, types, event labels
      schemas/                   # Account, admin schemas
      server/                    # account/admin server functions
      ui/account/                # User/admin account center components
      ui/admin/                  # Admin user management components

  lib/                           # Core infrastructure
    index.ts                     # Re-exports shared infrastructure barrels
    db/
      index.ts                   # Drizzle client (env.DATABASE_URL)
      schema.ts                  # Barrel export for all schemas
      schema/
        auth/                    # user, session, account, verification, audit
        blog/                    # post, tags, categories, press releases
        content/                 # contentEntry, contentRevision, contentPublication
        email/                   # emailMessage, emailEvent, preferences, subscriptions
        media/                   # mediaAsset
        shared/                  # enums, timestamps, contactSubmission
      tests/                     # Schema contract & migration tests
    env/
      server.ts                  # Zod-validated server env (lazy proxy)
    errors/
      app-error.ts               # AppError class (extends Error)
      server-result.ts           # ServerResult<T> type + ok/fail helpers
      to-server-fail.ts          # Error → ServerFail converter
      safe-action-error.ts       # User-friendly error messages
    observability/
      logger.ts                  # Structured logger with redaction
      mutation-log.ts            # Mutation log helper contract
    rateLimit/
      limiter.ts                 # Durable limiter with memory fallback
    search/
      fts.ts                     # Postgres FTS helper primitives
    server/
      index.ts                   # Exports server runtime utilities
      background-tasks.ts        # Persistent job queue (Postgres-backed)
    utils/
      index.ts                   # Barrel export
      cn.ts                      # clsx + tailwind-merge
      generate-slug.ts
      get-initials.ts
      social-share.ts            # Platform share helpers (SSR-safe)

  components/
    ui/                          # shadcn/ui components
    layout/                      # App-level layout composition primitives
      app-shell.tsx
      top-bar.tsx
      page-header.tsx
    metrics/
      stat-card.tsx              # KPI/stat display card
    forms/
      search-input.tsx           # Search field composition
      tag-picker.tsx             # Controlled tag entry composition
    editor/
      editor-shell.tsx           # Shared editor control + layout shell
    theme/                       # Theme system (SSR-safe, cookie-based)
      constants.ts               # Cookie name, max-age, media query
      theme-script.ts            # Blocking inline script (prevents FOWT)
      theme-provider.tsx         # React context provider
      use-theme.ts               # Consumer hook
      theme-toggle.tsx           # UI toggle (shadcn dropdown)
    brand/                       # Brand system (white-label ready)
      brand.config.ts            # Brand constants
      brand.types.ts             # Brand type definitions
      brand-provider.tsx         # React context provider
      brand-logo.tsx             # Logo image component
      brand-wordmark.tsx         # Site name text component
      brand-badge.tsx            # Badge variant
      brand-meta.ts              # SEO meta helpers
    errors/                      # Error boundary components
      error-component.tsx        # Generic error display with retry
      not-found.tsx              # 404 page with brand badge
    empties/
      empty-state.tsx            # Reusable empty state
    tables/                      # Data table system (TanStack Table)
      table.tsx                  # Base HTML table components
      data-table.tsx             # Full-featured table with sorting/filtering
      data-table-column-header.tsx
      data-table-pagination.tsx
      data-table-toolbar.tsx
    navigation/
      site-header.tsx            # Sticky nav with logo and theme toggle
      site-navigation.ts         # Navigation link definitions

  hooks/
    use-mobile.ts                # Mobile breakpoint detection

docs/
  adr/                           # Architecture Decision Records
```

---

## Feature Module Convention

Each feature follows a consistent internal structure:

```
features/<name>/
  index.ts           # Public barrel export
  client/            # Browser-only client SDK wrappers
  hooks/             # React hooks (optional)
  lib/               # Feature-local utilities (query keys, etc.)
  model/             # Domain types, filters, business logic
  schemas/           # Zod validation schemas
  server/            # Server-only modules (*.server.ts for server-only code)
  tests/             # Vitest test files
  ui/                # React components
    admin/           # Admin-facing UI
    account/         # User-facing account UI
    public/          # Public-facing UI
```

**Naming conventions:**
- Server-only files: `*.server.ts` suffix
- Test files: `*.test.ts` suffix
- kebab-case for all filenames

---

## Routing Architecture

TanStack Router pathless layout routes (`_prefix`) group routes under shared layouts and guards without affecting URLs:

| Layout | URL prefix | Purpose |
|--------|-----------|---------|
| `_public` | `/` | Marketing pages, public content |
| `_auth` | `/login`, `/signup`, `/account`, etc. | Auth + account flows |
| `_legal` | `/privacy-policy`, etc. | Legal pages |
| `admin` | `/admin/*` | Protected admin area |

The `/admin` layout route includes a `beforeLoad` guard that redirects unauthenticated users to `/login`. See ADR-0009.

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

1. Better Auth config at `src/features/auth/server/auth.ts` with `tanstackStartCookies()` + `admin()` plugins
2. API handler at `src/routes/api/auth/$.ts` — catch-all for `/api/auth/*`
3. Client-side auth via `src/features/auth/client/auth-client.ts`
4. Server-side session via `getRequestHeaders()` + `auth.api.getSession({ headers })`
5. Route protection via `beforeLoad` on admin layout route
6. Server function auth via `requireSession()` / `requireAdmin()` from session.server.ts
7. Permission enforcement via `authorize()` from authorize.ts

Defense-in-depth: routes guard navigation, server functions guard data.

---

## Email Infrastructure

Pluggable email provider system with background task processing:

1. **Provider registry** (`provider-registry.server.ts`) — resolves `EMAIL_PROVIDER` env to Resend, SendGrid, or noop
2. **Send pipeline** (`send.server.ts`) — queues via background tasks, handles retries
3. **Templates** (`templates.server.tsx`) — React Email components rendered to HTML
4. **Webhooks** (`webhooks.server.ts`) — provider event processing
5. **Background tasks** (`lib/server/background-tasks.ts`) — Postgres-backed job queue with retry logic

See ADR-0013.

---

## Database Strategy

- Single region: AWS Asia Pacific (Singapore)
- Driver: `@neondatabase/serverless` (HTTP mode for serverless)
- Schema modularized by domain under `src/lib/db/schema/<domain>/`
- Environment validated via Zod (`src/lib/env/server.ts`)
- Drizzle Kit discovers schemas via glob: `**/index.ts`
- Migrations output to `./drizzle/`

**Schema domains:** auth, blog, content, email, media, shared

---

## TanStack Query

Global `QueryClient` in root with sensible defaults:

```ts
new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
})
```

Each feature defines query keys in `lib/query-keys.ts` for cache coordination.

---

## TanStack Table

Headless table library for admin data tables. Reusable components in `src/components/tables/`:

- `DataTable` — full-featured table (sorting, filtering, pagination, row selection)
- `DataTableColumnHeader` — sortable column with visual indicators
- `DataTablePagination` — page controls with rows-per-page selector
- `DataTableToolbar` — search and filter reset

Table devtools are **per-table instance** (not global), attached alongside each table component in development.

---

## CSS Design Tokens

All styling uses CSS variable tokens defined in `src/styles.css`. **No hardcoded Tailwind color scales** (e.g., `blue-500`, `rose-700`) are permitted in components.

**Token categories:**
- Colors: `background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `popover`
- Sidebar: `sidebar`, `sidebar-primary`, `sidebar-accent`, `sidebar-border`, `sidebar-ring`
- Charts: `chart-1` through `chart-5`
- Radius: `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`

**Status color mapping:**
- Error/failure → `destructive` tokens (`bg-destructive/10`, `text-destructive`)
- Success → `accent` tokens (`bg-accent/10`, `text-accent`)
- Neutral/warning → `muted` tokens (`bg-muted`, `text-muted-foreground`)
- Info/default → `secondary` tokens (`bg-secondary`, `text-muted-foreground`)

Dark mode via `@custom-variant dark (&:is(.dark *))` with OKLCH color values.

---

## Theme System

Cookie-based dark mode with SSR flash prevention:

1. **Blocking `<script>` in `<head>`** reads `ui-theme` cookie and applies `dark`/`light` class to `<html>` before first paint
2. **`suppressHydrationWarning`** on `<html>` prevents React warnings from the script's class modification
3. **`ThemeProvider`** syncs React state from cookie — exposes `theme`, `resolvedTheme`, `setTheme`
4. **`useTheme()`** hook for components — `resolvedTheme` is always `'dark'` or `'light'` (never `'system'`)
5. **System preference listener** tracks OS changes in real-time when in system mode

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
| 0012 | Feature Module Architecture | Accepted |
| 0013 | Email Infrastructure & Background Tasks | Accepted |
| 0014 | CSS Design Token Strategy | Accepted |
| 0015 | Environment Contract and Runtime Validation | Accepted |
| 0016 | Shared Utility Layer Standards | Accepted |
| 0017 | Error Taxonomy and ServerFail Conversion | Accepted |
| 0018 | Cross-Cutting Infrastructure Layer Organization | Accepted |
| 0019 | Auth Feature Hardening and Lib Integration | Accepted |
| 0020 | Shared Component Composition Layer | Accepted |
| 0021 | Users Account and Admin Route Integration | Accepted |

---

## Pre-Feature Checklist

Completed items from the initial checklist:

- [x] Wire up `_auth/route.tsx` layout with centered form layout
- [x] Implement login, signup, forgot-password, reset-password pages
- [x] Add `notFoundComponent` to root route
- [x] Add `errorComponent` to root route
- [x] Set up TanStack Query with global QueryClient
- [x] Set up reusable data table components
- [x] Implement email infrastructure with pluggable providers

Remaining before CMS/KB features:

- [x] Add `beforeLoad` auth guard to `admin/route.tsx`
- [ ] Test redirect flow: unauthenticated → login → redirect back
- [ ] Create first admin user via seed script (`pnpm seed:editorial`)
- [x] Wire up admin user management to server functions
- [ ] Implement blog CRUD server functions
- [ ] Implement content CMS server functions

---
