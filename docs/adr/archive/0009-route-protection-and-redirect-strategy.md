# ADR 0009 — Route Protection & Redirect Strategy

**Status:** Accepted
**Date:** 2026-02-17
**Related ADRs:**

- 0001 Project Foundation
- 0003 Authentication & Authorization
- 0008 Auth Integration, Server Functions & Error Contract

---

## Context

Nu Graphix Studio has a working auth integration (Better Auth + TanStack Start server functions), but no route-level protection exists yet. The `/admin/` route is accessible to anyone. Before building features, we must establish a consistent route protection strategy that aligns with TanStack Start's intended patterns.

Key questions resolved:

1. How do we protect admin routes from unauthenticated access?
2. Where does the auth check happen — route level or component level?
3. How do we redirect unauthenticated users?
4. How do we share user context with child routes?

---

## Decision

### 1. Use Pathless Layout Routes for Auth Boundaries

TanStack Start provides **pathless layout routes** (prefixed with `_`) that group routes under a shared `beforeLoad` guard without affecting the URL structure.

```
src/routes/
  _authenticated.tsx           # Auth boundary (runs beforeLoad)
  _authenticated/
    admin/
      index.tsx                # /admin — protected
      posts/
        index.tsx              # /admin/posts — protected
    dashboard.tsx              # /dashboard — protected
  login.tsx                    # /login — public
  index.tsx                    # / — public
```

### 2. Use `beforeLoad` for Auth Checks

Route protection uses TanStack Router's `beforeLoad` hook, which runs **before** loaders or components render. This prevents:

- Data fetching for unauthenticated users
- Flash of protected content
- Unnecessary server function calls

Pattern:

```ts
// routes/_authenticated.tsx
import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth/auth'

const getSessionForRoute = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    return session
  },
)

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const session = await getSessionForRoute()

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    return { user: session.user }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <Outlet />
}
```

### 3. Child Routes Access User via Context

Child routes under `_authenticated` can access the authenticated user via `Route.useRouteContext()`:

```ts
// routes/_authenticated/admin/index.tsx
export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminHome,
})

function AdminHome() {
  const { user } = Route.useRouteContext()
  // user is guaranteed to exist
}
```

Or in loaders:

```ts
export const Route = createFileRoute('/_authenticated/admin/')({
  loader: async ({ context }) => {
    // context.user is guaranteed by parent beforeLoad
    return await someServerFn({ data: { userId: context.user.id } })
  },
})
```

### 4. Redirect Preservation

Login route captures the redirect target via search params:

```ts
// routes/login.tsx
import { z } from 'zod'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginPage,
})
```

After successful login, redirect to the original destination or default:

```ts
navigate({ to: redirect ?? '/admin' })
```

### 5. Server Function Auth Checks Remain

Route-level protection guards the UI. Server functions **must still validate auth independently**:

```ts
// features/cms/server/posts.mutations.ts
export const cmsCreatePostFn = createServerFn({ method: 'POST' })
  .validator(createPostSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const user = await requireUserFromHeaders(headers)
    // ... proceed with authorized user
  })
```

This is defense-in-depth: routes guard navigation, server functions guard data.

### 6. `notFound()` and `redirect()` Are Thrown, Not Wrapped

TanStack Start provides `notFound()` and `redirect()` as throwable utilities that integrate with the router. These must be **thrown**, not wrapped in `ServerResult`:

```ts
// In server functions:
throw notFound()       // Shows notFoundComponent
throw redirect({ to: '/login' })  // Navigates to login

// In beforeLoad:
throw redirect({ to: '/login', search: { redirect: location.href } })
```

The `ServerResult<T>` contract handles **business logic results** (success, validation errors, conflicts). Framework-level signals use throws.

---

## Consequences

### Positive

- Auth check happens before any data loads
- No flash of protected content
- User context flows to all child routes via context
- Redirect URL preserved for post-login navigation
- Defense-in-depth: both route guards and server function checks
- Aligns with TanStack Start's intended patterns

### Trade-offs

- `beforeLoad` runs on every navigation to a protected route (acceptable for admin-only)
- Session check is a network call (mitigated by cookie-based session)
- Must create login route before protection works

---

## Implementation Checklist

- [ ] Create `_authenticated.tsx` pathless layout route
- [ ] Move `/admin/` under `_authenticated/admin/`
- [ ] Create `/login` route with redirect search param
- [ ] Verify `notFoundComponent` on root route
- [ ] Test redirect flow end-to-end

---
