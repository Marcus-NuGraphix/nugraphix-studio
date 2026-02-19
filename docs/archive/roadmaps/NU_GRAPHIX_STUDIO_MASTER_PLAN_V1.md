# NU GRAPHIX STUDIO

# MASTER ENGINEERING & PRODUCT PLAN — v1.0

---

# PHASE 1 — STRATEGY & FOUNDATIONS

## 1️⃣ Vision & Product Definition

### Objective

Build **Nu Graphix Studio** — a dual-purpose platform that:

1. Markets Nu Graphix publicly (authority + lead generation).
2. Operates as an internal execution engine (CMS + Knowledge Base + Architecture Docs).
3. Forms the structured foundation for future vertical SaaS products.

This is not “a website”.

It is:

* A marketing engine
* A knowledge engine
* A systems architecture laboratory
* A SaaS incubation platform

---

## Product Positioning

Nu Graphix Studio positions Nu Graphix as:

> A structured digital systems architecture consultancy — not a generic dev shop.

---

## MVP Scope (Strict Cutline)

### INCLUDED (MVP)

* Marketing site
* Blog (rich text)
* Case studies
* Contact form
* Admin CMS
* Knowledge Base
* Architecture documentation hub
* Auth (admin only)
* Email notifications
* Observability + logging
* CI/CD pipeline

### EXCLUDED (Post-MVP)

* Client portal
* Billing/subscriptions
* Multi-tenant UI
* CRM dashboard
* Advanced analytics dashboard
* Social content automation
* RLS enforcement (app-level scoping only initially)

---

## Success Metrics

### Business

* Qualified inbound leads/month
* Conversion rate: Lead → Consult
* Revenue per client
* Blog publishing consistency

### Internal

* KB entries/week
* Time to publish content
* Reusable system patterns documented
* Feature velocity

---

# PHASE 2 — DESIGN SYSTEM & UI/UX

## 2️⃣ Design System Standards

### Colors

Primary: Cyan
Secondary: Emerald
Neutral: Slate

Rules:

* Cyan = action
* Emerald = success
* Neutrals dominate UI
* Dark/light mode supported from start

---

## Typography

* Font: Inter
* Mono: JetBrains Mono
* Controlled scale
* Marketing hero: 3xl–4xl
* Admin headers: 2xl
* Body: base

---

## Spacing

Restricted Tailwind scale:
`0,1,2,3,4,6,8,10,12,16,20`

---

## Border Radius

* Inputs: `rounded-md`
* Cards: `rounded-xl`
* Modals: `rounded-2xl`

---

## Content Editing Standard

### Rich Text Editor

Editor: **ProseKit**

Content storage:

* `content_json` (ProseMirror JSON)
* `content_text` (extracted plain text for search)
* Optional future: cached HTML

Security:

* No raw HTML rendering without sanitization
* Strict CSP in production
* XSS-safe rendering

---

## Layout System

* Marketing Layout
* Auth Layout
* Admin Layout
* (Future) Org App Layout

---

# PHASE 3 — ENGINEERING SYSTEM

Stack:

* TanStack Start
* Server Functions
* Better Auth
* Drizzle ORM
* Neon PostgreSQL
* Zod validation
* Tailwind + shadcn/ui
* TanStack Query
* TanStack Table

---

## Folder Structure

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
  lib/
    auth/
    db/
    errors/
    email/
    observability/
  ui/
```

---

## Server Function Contract

Every server function returns:

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

## Error Rules

* Business/validation errors → return `ServerResult`
* Redirect/notFound → throw
* Unexpected internal failures → return `{ code: 'INTERNAL' }`

---

## Auth Rules

* Roles: `guest`, `admin`
* All role checks enforced server-side
* Never trust client role flags

---

# PHASE 4 — SECURITY & QUALITY

## Data

* Zod validation on all mutations
* Sanitized rich text rendering
* No raw HTML injection
* Parameterized Drizzle queries
* Ownership checks (future ready)

---

## Auth & Permissions

* requireUser()
* requireAdmin()
* Resource-level validation
* Role checks inside server functions only

---

## API Hardening

* Rate limiting on:

  * Contact form
  * Auth endpoints
* Cloudflare Turnstile for public forms
* No sensitive error leaks
* Structured logging

---

## Secrets

* `.env` in `.gitignore`
* No client exposure of secrets
* PUBLIC_ prefix only for safe env vars

---

# PHASE 5 — ERROR MANAGEMENT SYSTEM

## Debug Protocol

After 3 failed attempts:

1. Freeze changes
2. Define issue clearly
3. Ask AI for suspects (not fixes)
4. Add targeted logs
5. Provide logs
6. Fix one confirmed cause

---

## AI Mistakes Log

Location:

```
/docs/ai-mistakes.md
```

Tracks:

* Mistake
* Root cause
* Prevention rule
* Detection signal

---

# PHASE 6 — CI/CD & RELEASE DISCIPLINE

## Environments

* Local
* Staging (dev branch)
* Production (main branch)

---

## CI Pipeline

On push:

* Type check
* Lint
* Test
* Build
* Deploy if branch matches

---

## Migration Discipline

* Generate new migration
* Test in staging
* Production migration runs during deploy
* Backup verified before production schema change

---

## Deployment Checklist

Before release:

* CI green
* Migration tested
* Env vars verified
* Smoke test ready

After release:

* Auth works
* Admin loads
* Contact form works
* Logs clean

---

# PHASE 7 — SAAS READINESS

## Tenant Model (Planned, Not Activated)

* `Organization`
* `Membership`
* Role scoped per org

MVP remains single-tenant (admin only).

---

## Data Rules (Future-Ready)

When SaaS begins:

* Add `orgId` to tenant-owned tables
* Enforce scoped queries
* Add RLS later
* Add audit logs for critical actions

---

# INTEGRATION DECISIONS (v1)

## Email

MVP: SendGrid Free Tier
Upgrade path: Postmark or Resend
All email logic via server functions only.

---

## Observability

* Sentry (free tier)
* Cloudflare Workers logs
* Structured mutation logs

---

## Bot Protection

* Cloudflare Turnstile (free)

---

## Search

MVP: Postgres Full-Text Search
Future: Meilisearch

---

## Storage

* Cloudflare R2
* Signed uploads
* MIME + size validation

---

## Analytics

MVP: Umami or Plausible
Future: GA4 if needed

---

# ENGINEERING PRINCIPLES

1. Build small.
2. Validate everything.
3. Log all mutations.
4. Enforce roles server-side.
5. Separate environments strictly.
6. Never refactor blindly.
7. AI follows constraints.
8. SaaS readiness without premature complexity.
9. Security is built-in, not bolted-on.
10. Production is sacred.

---

# FINAL SANITY CHECK SUMMARY

This plan:

* Avoids premature SaaS complexity
* Uses generous free-tier services
* Avoids self-hosting burden
* Has clear upgrade paths
* Prevents architectural drift
* Prevents AI chaos
* Supports long-term vertical SaaS pivot
* Keeps MVP lean and achievable

---

# STATUS

You now have:

* Strategy
* UX System
* Engineering System
* Security Framework
* Debug Protocol
* Deployment Discipline
* SaaS Expansion Blueprint
* Integration Matrix

This is a **professional-grade operating system for a solo technical founder.**

---

