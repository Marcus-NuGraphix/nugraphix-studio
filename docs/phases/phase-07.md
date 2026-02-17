# PHASE 7 — SAAS READINESS & MULTI-TENANT ARCHITECTURE PLANNING

## Nu Graphix Studio Productization & Scale Blueprint

(Refined version of )

---

# Philosophy

Phase 7 does **not** turn Nu Graphix Studio into SaaS.

Phase 7 ensures:

* When SaaS activates,
* You do not rewrite architecture,
* You do not refactor half the database,
* You do not compromise security.

This phase is **design for expansion**, not implementation.

---

# 24️⃣ SaaS Readiness Goals

Nu Graphix Studio must evolve from:

* Single-tenant (admin-only)
  to:
* Multi-tenant (organizations, clients, members)

Without:

* Rewriting routes
* Rewriting DB schema
* Rewriting auth system
* Rewriting server functions

---

## Non-Goals (Strict)

Not building now:

* Billing
* Stripe integration
* Enterprise SSO
* Full RLS policies
* Advanced permission builder UI
* Multi-org switching UI

Architecture only. No SaaS UI yet.

---

# 25️⃣ Tenant Model (Locked Decision)

### Core Model: Organization-Based Tenancy

Standardized Terms:

* Tenant → `Organization`
* Member → `User` inside organization
* Role → permission inside organization

---

## Base Entities (Future Activation)

### Organization

Minimum columns:

* id (uuid)
* name
* slug (unique)
* plan (nullable initially)
* status (active/suspended)
* createdAt
* updatedAt

---

### Membership

Join table:

* userId
* orgId
* role
* createdAt

Unique constraint:

* unique(userId, orgId)

---

## Why This Model?

* Compatible with Better Auth
* Compatible with Drizzle
* Compatible with Postgres RLS
* Compatible with future billing
* Supports multi-org users
* Supports platform-level admin (you)

---

# 26️⃣ Identity & Permission Model

Authentication:

* Better Auth proves identity

Authorization:

* Role + org scope enforced server-side

Never:

* Trust client-provided orgId
* Trust role from frontend
* Allow unscoped queries

---

## Role Tiers (Future-Ready)

Platform-level:

* admin (you only)

Org-level:

* org_owner
* org_admin
* org_member

Future:

* course_member

---

## Permission Model (Minimalist, Not Overbuilt)

Use:

RBAC + resource-level checks

No dynamic permission builder.
No permission UI.
No granular ACL matrix.

Keep it simple.

---

# 27️⃣ Multi-Tenant Data Strategy (Drizzle + Postgres)

Tenant-owned tables must include:

* id
* orgId (indexed)
* createdBy
* createdAt
* updatedAt
* optional deletedAt

---

## Mandatory Constraints

* unique(orgId, slug)
* foreign key orgId → organization.id
* index on orgId

---

## Soft Delete Policy (Strongly Recommended)

For SaaS-facing tables:

* Add `deletedAt`
* Queries default to `deletedAt IS NULL`

Reason:

* Prevents permanent data loss
* Enables audit recovery
* Enables “restore” UI later

---

# 28️⃣ Query Scoping Standard (Before RLS)

Even before enabling Postgres RLS:

Every tenant query must:

1. Obtain orgId from session or route
2. Validate membership
3. Scope DB query by orgId
4. Return ServerResult
5. Log tenant context

---

## Standard Pattern (Future Server Function Template)

1. requireUser()
2. resolveOrgFromRoute()
3. requireOrgMembership()
4. optional requireOrgRole()
5. scoped DB query
6. structured log includes orgId

---

## No Exceptions Rule

No tenant query without orgId scope.

Ever.

---

# 29️⃣ Org Context Resolution Strategy

Recommended pattern: **Subpath**

Example:

```
/app/:orgSlug/dashboard
```

Advantages:

* Explicit
* Easy to debug
* No DNS complexity
* Compatible with TanStack Start routing
* SEO neutral

Subdomain can be added later.

---

## Required Utilities (Pre-Built, Not Activated)

Create stubs early:

* requireUser()
* requireOrgMembership(orgId)
* requireOrgRole(orgId, roles[])

These become SaaS guardrails.

---

# 30️⃣ SaaS UI Architecture (Future Only)

Current:

* `/`
* `/admin/*`

Future:

* `/app/:orgSlug/*`

Layouts:

* Marketing layout
* Platform admin layout (you)
* Org layout (tenant-scoped)

---

## Org Layout Rules

* Sidebar scoped to org
* Topbar shows org name
* Clear separation from platform admin
* No shared navigation confusion

---

# 31️⃣ Productization Strategy (Consultancy → SaaS)

Nu Graphix’s moat is pattern extraction.

---

## The Pattern Extraction Loop

1. Build custom solution for client.
2. Identify repeatable data model.
3. Identify repeatable workflow.
4. Identify repeatable reporting.
5. Extract as reusable feature module.
6. Add configuration layer.
7. Generalize to vertical SaaS component.

---

## Pattern Readiness Criteria

Before extracting to SaaS:

* Used by 2+ clients
* Same workflow structure
* Same core data relationships
* Same UI module pattern
* Same reporting logic

If not repeatable, don’t productize yet.

---

# 32️⃣ Plan & Billing Readiness (Design-Only)

Add optional fields early:

On Organization:

* plan
* trialEndsAt
* billingStatus

But:

Do not build gating UI.

---

## Future Gating Rule

Feature gating must:

* Happen server-side
* Be plan-aware
* Return FORBIDDEN if plan disallows

Never gate purely in UI.

---

# 33️⃣ Audit Log Design (Multi-Tenant Ready)

When onboarding clients:

Add tenant-aware audit table:

* orgId
* actorUserId
* action
* resourceType
* resourceId
* metadata (jsonb)
* createdAt

All critical mutations must log.

Audit logs must include orgId.

---

# 34️⃣ Data Isolation Guarantees

When SaaS activates:

* No cross-org queries
* No shared mutable state
* No global data leakage
* Logs include orgId
* All background jobs scoped by orgId
* All exports filtered by orgId

Isolation is mandatory.

---

# 35️⃣ Data Portability & Export Strategy

Every core tenant entity must:

* Be exportable to CSV
* Be filtered by orgId
* Exclude other tenant data
* Respect soft delete

Never trap client data.

---

# 36️⃣ Background Jobs & Async Readiness (Future Planning)

When SaaS grows:

Examples:

* Report generation
* Email campaigns
* Bulk imports
* Scheduled tasks

Plan early:

* Job must include orgId
* Job must validate org existence
* Job must log orgId
* Job must respect plan limits

Even async logic must be tenant-aware.

---

# 37️⃣ RLS Activation Strategy

Enable RLS when:

* First external client onboarded
* Multiple orgs exist
* Member accounts created

---

## Safe Activation Path

1. orgId already exists everywhere
2. Queries already scoped in code
3. Enable RLS
4. Mirror logic in DB policies
5. Test staging thoroughly

RLS becomes safety net, not primary defense.

---

# 38️⃣ SaaS Activation Trigger

Nu Graphix Studio becomes SaaS when:

* 2+ clients need similar system
* Feature repeatability proven
* Billing value clear
* Support burden manageable
* Infrastructure stable

Do not activate SaaS before pattern maturity.

---

# 39️⃣ Nu Graphix SaaS Readiness Checklist

Before onboarding first tenant:

* [ ] orgId present in tenant tables
* [ ] unique(orgId, slug) enforced
* [ ] Queries scoped by orgId
* [ ] Membership checks enforced
* [ ] Role checks implemented
* [ ] Audit logging enabled
* [ ] Export capability exists
* [ ] Rate limiting active
* [ ] Error messages sanitized
* [ ] Backups verified
* [ ] Staging mirrors production
* [ ] Sentry capturing org context

---

# 40️⃣ SaaS Architectural Principles (Final)

1. Model tenants early.
2. Every tenant-owned row includes orgId.
3. Server enforces scope.
4. UI never decides permission.
5. Productization is extraction, not rewrite.
6. Billing is layered on top, not woven into core logic.
7. Isolation is absolute.
8. Auditability builds trust.
9. Async work must be tenant-aware.
10. SaaS activation must be earned, not rushed.

---

# Phase 7 Outcome

After this refinement:

* You have SaaS-ready schema planning.
* You have org-aware query discipline.
* You have plan-aware architecture design.
* You have background job foresight.
* You have isolation guarantees.
* You have activation criteria.
* You have no premature SaaS complexity.

---
