# NU GRAPHIX STUDIO — BUILD ROADMAP v1.0

---

# WEEK 0 — Foundation & Repo Bootstrapping

## Goal

Get the skeleton running with zero feature complexity.

### Tasks

#### 1️⃣ Create project

* Initialize TanStack Start app
* Setup TypeScript strict mode
* Configure Tailwind
* Install shadcn/ui
* Configure dark mode
* Add ESLint + Prettier

#### 2️⃣ Install core dependencies

* Drizzle
* Neon client
* Better Auth
* Zod
* TanStack Query
* TanStack Table
* ProseKit
* Sentry
* SendGrid SDK
* Cloudflare Turnstile SDK (or verification utility)

#### 3️⃣ Create folder structure

```
src/
  routes/
  features/
  lib/
    auth/
    db/
    errors/
    email/
    observability/
  ui/
docs/
```

#### 4️⃣ Setup CI

* GitHub Actions:

  * typecheck
  * lint
  * build

#### 5️⃣ Setup environments

* Local `.env.local`
* Staging `.env.staging`
* Production `.env.production`

---

# WEEK 1 — Auth + Core Infrastructure

## Goal

Secure admin-only system with server function contract.

---

### Tasks

#### 1️⃣ Setup Drizzle

* Configure Neon connection
* Create initial migration
* Verify local migration runs

#### 2️⃣ Setup Better Auth

* Configure Drizzle adapter
* Create admin user manually
* Implement:

  * `requireUser()`
  * `requireAdmin()`

#### 3️⃣ Implement ServerResult contract

* Create:

  * `AppError.ts`
  * `toServerFail.ts`
* Standardize server function template

#### 4️⃣ Protect admin route

* Create `/admin`
* Restrict via server-side check
* Test redirect for guest

#### 5️⃣ Add Sentry

* Setup error capture
* Trigger test error
* Confirm capture in dashboard

---

# WEEK 2 — Marketing Skeleton

## Goal

Public-facing structure live.

---

### Tasks

#### 1️⃣ Build layouts

* Marketing layout
* Auth layout
* Admin layout

#### 2️⃣ Create static pages

* `/`
* `/about`
* `/services`
* `/contact`

#### 3️⃣ Add Turnstile to contact form

* Server-side verification
* Rate limiting logic

#### 4️⃣ Setup email service

* SendGrid integration
* Contact form sends email
* Verify delivery

---

# WEEK 3 — CMS Core (Posts)

## Goal

Admin can create and publish blog posts.

---

### Tasks

#### 1️⃣ Create DB schema

* posts table:

  * id
  * title
  * slug (unique)
  * content_json
  * content_text
  * status (draft/published)
  * createdAt / updatedAt

#### 2️⃣ Generate migration

* Apply locally
* Apply to staging

#### 3️⃣ Create server functions

* cmsListPostsFn
* cmsGetPostFn
* cmsCreatePostFn
* cmsUpdatePostFn
* cmsPublishPostFn

All:

* Zod validation
* requireAdmin()
* Return ServerResult

#### 4️⃣ Integrate ProseKit editor

* Admin post editor
* Save JSON
* Extract plain text
* Preview mode

#### 5️⃣ Public blog route

* `/blog`
* `/blog/:slug`
* Render from JSON safely

---

# WEEK 4 — Case Studies + KB System

## Goal

Authority + internal system documentation engine.

---

### Tasks

#### 1️⃣ Case studies

* Same schema pattern as posts
* Separate route: `/portfolio`
* Admin management

#### 2️⃣ Knowledge Base schema

* id
* title
* slug
* category
* tags (array)
* content_json
* content_text

#### 3️⃣ KB server functions

* list
* get
* create
* update

#### 4️⃣ Implement search (Postgres FTS)

* tsvector column
* simple search query
* KB search bar

---

# WEEK 5 — Architecture Docs Hub

## Goal

Formalize your internal engineering knowledge.

---

### Tasks

#### 1️⃣ Create docs section

* `/admin/docs`
* Structured sections (ADR, design system, runbooks)

#### 2️⃣ Store docs in DB (same rich text model)

#### 3️⃣ Add tagging system (if not already)

#### 4️⃣ Add audit log table

* Log:

  * publish
  * delete
  * role change
  * settings change

---

# WEEK 6 — Hardening Phase

## Goal

Make it production-grade.

---

### Tasks

#### 1️⃣ Security pass

* Review all server functions
* Verify validation everywhere
* Confirm no raw HTML rendering
* Confirm no secret leakage

#### 2️⃣ Logging enforcement

* Add structured logs to mutations
* Verify logs in production

#### 3️⃣ Rate limiting review

* Confirm login protected
* Confirm contact protected

#### 4️⃣ Add CSP headers

* Restrict inline scripts
* Restrict external domains

---

# WEEK 7 — Observability + Performance

## Goal

Make it measurable.

---

### Tasks

#### 1️⃣ Add performance tracing in Sentry

#### 2️⃣ Verify no N+1 DB queries

#### 3️⃣ Add indexes to:

* slug
* createdAt
* search columns

#### 4️⃣ Add simple analytics

* Umami or Plausible
* Track blog views
* Track contact conversions

---

# WEEK 8 — Final Polish & Launch Prep

## Goal

Stable public release.

---

### Tasks

#### 1️⃣ Final content polish

* At least 3 blog posts
* 2 case studies
* Clear services explanation

#### 2️⃣ Final deployment checklist

* CI green
* Migration verified
* Backup confirmed
* Smoke test executed

#### 3️⃣ Tag release

`v0.1.0`

#### 4️⃣ Announce launch

---

# After Launch (Month 2+)

Only after launch:

* Improve search UX
* Add content pipeline workflow
* Add analytics dashboard
* Begin SaaS feature extraction loop

---

# Execution Rules

While building:

1. Never build more than the current week’s scope.
2. Never refactor mid-feature.
3. Never add SaaS complexity early.
4. Always commit small.
5. Always deploy staging first.
6. Always log mutations.
7. Use AI only step-by-step.

---

# Realistic Time Estimate

If focused:

* 6–8 weeks part-time
* 3–4 weeks full-time

---

# Final Note

If you follow this roadmap strictly:

By Week 4 you already have:

* Auth
* CMS
* Blog
* Portfolio
* Knowledge Base
* Email
* Search
* Observability

Which is more structured than 95% of agency sites.

---
