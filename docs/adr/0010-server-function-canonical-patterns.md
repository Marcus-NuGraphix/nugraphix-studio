# ADR 0010 — Server Function Canonical Patterns

**Status:** Accepted
**Date:** 2026-02-17
**Related ADRs:**

- 0008 Auth Integration, Server Functions & Error Contract
- 0009 Route Protection & Redirect Strategy

---

## Context

Before building CMS and Knowledge Base features, we need to lock in the exact server function patterns that all feature code must follow. ADR-0008 established the `ServerResult<T>` contract, but did not fully specify:

1. How `.validator()` chains work with Zod schemas
2. How `notFound()` and `redirect()` interact with the result contract
3. The canonical authenticated query pattern
4. The canonical authenticated mutation pattern
5. Where validation schemas live

This ADR codifies the patterns validated against TanStack Start documentation.

---

## Decision

### 1. Canonical Authenticated Query

Queries use `GET`, do not require `.validator()` when parameterless, and return `ServerResult<T>`:

```ts
// features/kb/server/kb.queries.ts
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { notFound } from '@tanstack/react-router'
import type { ServerResult } from '@/lib/errors/serverResult'
import { ok } from '@/lib/errors/serverResult'
import { toServerFail } from '@/lib/errors/toServerFail'
import { requireUserFromHeaders } from '@/lib/auth/session'
import { db } from '@/lib/db/client'

export const kbGetEntryFn = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }): Promise<ServerResult<KbEntryDTO>> => {
    try {
      const headers = getRequestHeaders()
      await requireUserFromHeaders(headers)

      const entry = await db.query.kbEntries.findFirst({
        where: (t, { eq }) => eq(t.id, data.id),
      })

      if (!entry) throw notFound()

      return ok(mapToDTO(entry))
    } catch (err) {
      // Re-throw framework signals (notFound, redirect)
      if (err instanceof Response || (err as any)?.isNotFound) throw err
      return toServerFail(err)
    }
  })
```

**Key rules:**
- `getRequestHeaders()` called inside the handler (not outside)
- Auth check via `requireUserFromHeaders()`
- `notFound()` is **thrown**, not wrapped in ServerResult
- Framework signals (`notFound`, `redirect`) are **re-thrown**, not caught
- Business errors are caught and converted via `toServerFail()`

### 2. Canonical Authenticated Mutation

Mutations use `POST`, **must** have `.validator()`, and return `ServerResult<T>`:

```ts
// features/cms/server/posts.mutations.ts
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'
import type { ServerResult } from '@/lib/errors/serverResult'
import { ok } from '@/lib/errors/serverResult'
import { toServerFail } from '@/lib/errors/toServerFail'
import { requireUserFromHeaders } from '@/lib/auth/session'
import { db } from '@/lib/db/client'

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  content: z.string(),
})

export const cmsCreatePostFn = createServerFn({ method: 'POST' })
  .validator(createPostSchema)
  .handler(async ({ data }): Promise<ServerResult<{ id: string }>> => {
    try {
      const headers = getRequestHeaders()
      const user = await requireUserFromHeaders(headers)

      const [post] = await db.insert(posts).values({
        ...data,
        authorId: user.id,
      }).returning({ id: posts.id })

      return ok({ id: post.id })
    } catch (err) {
      if (err instanceof Response) throw err
      return toServerFail(err)
    }
  })
```

**Key rules:**
- `.validator(zodSchema)` is **required** on all mutations
- Zod validates input before the handler runs — invalid data never reaches your code
- The `data` parameter is fully typed from the schema
- Return type is always `Promise<ServerResult<T>>`

### 3. Framework Signals vs Business Errors

| Signal | How to use | Handled by |
|--------|-----------|------------|
| `notFound()` | `throw notFound()` | Router's `notFoundComponent` |
| `redirect()` | `throw redirect({ to: '/login' })` | Router navigation |
| Validation error | `return fail('VALIDATION_ERROR', ...)` | UI checks `result.ok` |
| Auth failure | `throw new AppError('UNAUTHORIZED', ...)` → caught → `return toServerFail(err)` | UI checks `result.error.code` |
| Conflict | `return fail('CONFLICT', ...)` | UI checks `result.error.code` |

**Rule:** Framework signals (`notFound`, `redirect`) are always thrown and re-thrown through catch blocks. They must never be wrapped in `ServerResult`.

### 4. Error Handling in `catch` Blocks

To safely re-throw framework signals while catching business errors:

```ts
catch (err) {
  // Re-throw framework signals
  if (err instanceof Response) throw err
  // Convert business errors to ServerResult
  return toServerFail(err)
}
```

The `notFound()` and `redirect()` utilities produce `Response` objects internally. Checking `instanceof Response` covers both.

### 5. Calling Server Functions

**From route loaders:**

```ts
export const Route = createFileRoute('/_authenticated/admin/posts/$postId')({
  loader: async ({ params }) => {
    const result = await cmsGetPostFn({ data: { id: params.postId } })
    return result
  },
  component: PostDetail,
})
```

**From components (via `useServerFn`):**

```ts
function CreatePostForm() {
  const createPost = useServerFn(cmsCreatePostFn)

  async function handleSubmit(values: CreatePostInput) {
    const result = await createPost({ data: values })
    if (result.ok) {
      navigate({ to: '/admin/posts/$postId', params: { postId: result.data.id } })
    } else {
      // Handle result.error
    }
  }
}
```

### 6. Validation Schema Location

Schemas live next to the server function that uses them:

```
src/features/cms/server/
  posts.mutations.ts       # Contains createPostSchema + cmsCreatePostFn
  posts.queries.ts         # Contains getPostParamsSchema + cmsGetPostFn
```

If a schema is shared between client validation and server validation, extract to:

```
src/features/cms/
  schemas/
    post.schema.ts         # Shared Zod schemas
  server/
    posts.mutations.ts     # Imports from ../schemas/post.schema.ts
```

### 7. Naming Conventions (Confirmed)

| Type | Pattern | Example |
|------|---------|---------|
| Query server fn | `<feature><Verb><Noun>Fn` | `kbListEntriesFn` |
| Mutation server fn | `<feature><Verb><Noun>Fn` | `cmsCreatePostFn` |
| Zod schema | `<verb><Noun>Schema` | `createPostSchema` |
| DTO type | `<Noun>DTO` | `PostDTO` |
| Query file | `<domain>.queries.ts` | `posts.queries.ts` |
| Mutation file | `<domain>.mutations.ts` | `posts.mutations.ts` |

---

## Consequences

### Positive

- Every server function follows a predictable pattern
- Framework signals integrate cleanly with the router
- Validation happens before handler code runs
- Type safety flows from schema to handler to UI
- Clear separation between framework errors and business errors

### Trade-offs

- `catch` blocks need the `instanceof Response` guard (minor boilerplate)
- Validation schemas are co-located by default, shared only when needed

---
