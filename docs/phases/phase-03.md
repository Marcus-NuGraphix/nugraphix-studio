# PHASE 3 — ENGINEERING SYSTEM

## Nu Graphix Studio Engineering Standards

---

# Engineering Philosophy

Nu Graphix Studio is not “just a project.”

It is:

* A structured engineering operating system
* A reusable delivery framework
* A SaaS incubation base

Every decision must favor:

* Predictability
* Repeatability
* Security
* Clarity
* Long-term scale

---

# 5️⃣ Git Workflow Standard

## Purpose

Create a disciplined Git workflow that:

* Keeps production stable
* Enables fast iteration
* Maintains architectural integrity
* Preserves auditability
* Scales to future collaborators

---

## Branch Strategy

### Permanent branches

* `main` → Production (always deployable)
* `dev` → Integration / Staging

### Working branches

* `feature/<scope>-<short-name>`
* `hotfix/<issue>-<short-name>`

Examples:

* `feature/cms-post-editor`
* `feature/kb-search`
* `hotfix/login-redirect-loop`

---

## Branch Rules

* ❌ Never commit directly to `main`
* ✅ Merge features into `dev`
* ✅ Only release from `dev` → `main`
* ✅ Hotfix merges into both `main` and `dev`
* ✅ Delete feature branches after merge
* ✅ Tag production releases

---

# Commit Rules (Conventional Commits)

### Allowed prefixes

* `feat:` new feature
* `fix:` bug fix
* `refactor:` internal non-behavior change
* `chore:` config/tooling
* `docs:` documentation

### Formatting rules

* Present tense
* Scoped
* One logical change per commit
* No “update stuff” commits

---

# Feature Completion Checklist (Definition of Done)

A feature is not complete until:

* [ ] Code written and working locally
* [ ] No TypeScript errors
* [ ] Lint passes
* [ ] Zod validation implemented
* [ ] Server-side role checks implemented
* [ ] Structured logging added (if mutation)
* [ ] Error states handled in UI
* [ ] Search index updated (if content change)
* [ ] Tests pass (if applicable)
* [ ] PR created
* [ ] PR reviewed (even if solo)
* [ ] Merged into `dev`

---

# 6️⃣ AI Operating Protocol

## Purpose

AI must act as a disciplined junior engineer, not an uncontrolled generator.

---

## AI Prompting Standard (Required Fields)

Every AI implementation request must include:

1. GOAL
2. CONTEXT
3. CONSTRAINTS
4. OUTPUT FORMAT
5. DO NOT CHANGE

---

## Mandatory Constraints (Always Include)

* Use TanStack Start server functions
* Use Drizzle ORM
* Validate inputs with Zod
* Enforce Better Auth role checks server-side
* Follow ServerResult contract
* Do not introduce new libraries
* Preserve existing architecture
* Do not modify unrelated files

---

## AI Usage Rules

* Implement one layer at a time:

  * Schema
  * Backend
  * UI shell
  * Form logic
* Never ask AI to build full systems
* Never allow architectural rewrites mid-feature

---

# 7️⃣ Feature Breakdown Template

All features must use the structured template (unchanged from your file, preserved intentionally).

This prevents scope creep and enforces layered development.

---

# ENGINEERING ARCHITECTURE (TanStack Start Specific)

---

# A) Project Folder Structure (Refined)

```
src/
  routes/
  features/
    <feature>/
      components/
      server/
        <feature>.queries.ts
        <feature>.mutations.ts
      db/
      schemas/
      types/
      utils/
      index.ts
  lib/
    auth/
      auth.ts
      session.ts
    db/
      client.ts
    errors/
      AppError.ts
      toServerFail.ts
    email/
      send.ts
      templates/
    observability/
      logger.ts
    rateLimit/
      limiter.ts
    search/
      fts.ts
    utils/
  ui/
```

---

# Architectural Principles

1. Feature-first structure
2. Server functions = backend layer
3. lib/ contains cross-feature infrastructure
4. routes/ define navigation only
5. No business logic inside UI components
6. No DB access outside server functions
7. Integration code isolated in `lib/`

---

# B) Better Auth + Drizzle Standards

## Canonical Locations

* `lib/auth/auth.ts`
* `lib/auth/session.ts`
* `lib/db/client.ts`

---

## Role Model (MVP)

* guest
* admin

No member or org roles in MVP.

Future roles must not influence current complexity.

---

# C) Server Function Conventions

## Naming

Suffix with `Fn`.

Examples:

* cmsListPostsFn
* cmsCreatePostFn
* kbSearchEntriesFn

---

## Responsibility Rules

* One responsibility per function
* No combined create/update unless justified
* No hidden side-effects
* All mutations log structured event

---

# D) Server Result Contract (Locked)

All server functions return:

```ts
type ServerResult<T> =
  | { ok: true; data: T }
  | {
      ok: false
      error: {
        code:
          | 'UNAUTHORIZED'
          | 'FORBIDDEN'
          | 'NOT_FOUND'
          | 'VALIDATION_ERROR'
          | 'CONFLICT'
          | 'RATE_LIMITED'
          | 'INTERNAL'
        message: string
        fieldErrors?: Record<string, string[]>
      }
    }
```

---

## Throw vs Return (Clarified Rule)

Throw:

* Redirect
* notFound
* Catastrophic invariant failure

Return `{ ok: false }`:

* Validation errors
* Permission denial
* Conflict
* Not found (normal UX case)

This rule prevents UI unpredictability.

---

# E) Standard Server Function Pattern (Finalized)

Every server function must:

1. Parse input with Zod
2. Authenticate user
3. Enforce role
4. Rate limit if public
5. Execute Drizzle query
6. Log mutation event
7. Return ServerResult
8. Map unknown errors to INTERNAL

---

# F) Logging & Observability Integration

Every mutation must log:

* feature
* action
* userId
* result
* errorCode
* timestamp

Never log:

* passwords
* tokens
* secrets
* raw content_json

Sentry captures:

* thrown errors
* unhandled exceptions
* performance traces

---

# G) Email Integration Standard

All email logic lives in:

```
lib/email/send.ts
```

Rules:

* Only server functions send email
* No client-triggered direct email
* Templates stored separately
* Log email attempt success/failure

---

# H) Rate Limiting Standard

Rate limit required for:

* Contact form
* Auth endpoints
* Any public write endpoint

Implementation abstracted under:

```
lib/rateLimit/
```

Must return `RATE_LIMITED` error code.

---

# I) Search Architecture (MVP)

* Use Postgres full-text search
* Maintain `content_text`
* Maintain `tsvector` column
* Index:

  * slug
  * createdAt
  * search columns

Search logic abstracted under:

```
lib/search/fts.ts
```

---

# J) Performance Safeguards

* Avoid N+1 queries
* Always limit list queries
* Paginate lists
* Lazy-load ProseKit editor
* Avoid heavy client bundles

---

# K) Redirect & Route Protection Standard

Admin route access:

* Server-side check
* No client-only protection

Public blog routes:

* Use notFound() for missing content

---

# L) Integration Abstraction Rule

All external services must be wrapped:

* Email → `lib/email`
* Search → `lib/search`
* Observability → `lib/observability`
* Rate limit → `lib/rateLimit`

Never call third-party SDK directly inside feature server function.

This ensures easy migration later.

---

# M) Security Reinforcement

Server functions must:

* Never trust client data
* Never accept role from client
* Never expose internal DB error
* Never bypass Zod validation

---

# Nu Graphix Engineering Principles (Final)

1. Feature-first architecture
2. Server functions = backend
3. All mutations return ServerResult
4. Zod validates everything
5. Roles enforced server-side
6. Logging mandatory for mutations
7. Integration code isolated
8. Search index maintained
9. Rate limiting applied
10. AI follows the same rules

---
