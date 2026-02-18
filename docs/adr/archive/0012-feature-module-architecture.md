# ADR-0012: Feature Module Architecture

**Status:** Accepted
**Date:** 2026-02-17

## Context

As the application grew beyond basic auth and routing, we needed a clear organisational pattern for business logic. The initial structure mixed domain logic into `src/lib/` (auth config, error types) and `src/features/` (server functions). This created confusion about where new code should live and made import boundary enforcement harder.

## Decision

Adopt a **feature-sliced architecture** where each vertical feature owns its full stack:

```
features/<name>/
  index.ts           # Public barrel export
  client/            # Browser-only client SDK wrappers
  hooks/             # React hooks
  lib/               # Feature-local utilities (query keys, etc.)
  model/             # Domain types, filters, business logic
  schemas/           # Zod validation schemas
  server/            # Server-only modules
  tests/             # Vitest test files
  ui/                # React components
    admin/           # Admin-facing UI
    account/         # User-facing account UI
    public/          # Public-facing UI
```

### Rules

1. **`src/lib/`** contains only cross-cutting infrastructure: database client, error types, env validation, logger, rate limiting, background tasks, and utilities. It does NOT contain business logic.
2. **`src/features/`** contains all business logic organised by domain.
3. Features import from `@/lib/*` and `@/components/*` but never from other features (unless via a shared barrel export).
4. Server-only files use the `*.server.ts` suffix to enable ESLint boundary enforcement.
5. All filenames use kebab-case.
6. Each feature exports a public API via `index.ts` — internal modules are not imported directly by route files.

### Current Features

| Feature | Purpose |
|---------|---------|
| `auth` | Authentication, authorisation, session management, permissions |
| `contact` | Contact form submission, reCAPTCHA, lead management |
| `email` | Email sending, provider abstraction, templates, webhooks |
| `users` | Admin user management (CRUD, sessions, audit) |

## Consequences

- Clear ownership: every file belongs to exactly one feature or to shared infrastructure.
- ESLint `no-restricted-imports` rules enforce boundaries at lint time.
- New features follow a known template — no architectural decisions needed per feature.
- Test files live adjacent to the code they test, making coverage easy to track.
