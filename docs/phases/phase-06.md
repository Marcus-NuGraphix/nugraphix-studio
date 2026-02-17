# PHASE 6 — CI/CD, DEPLOYMENT & RELEASE DISCIPLINE

## Nu Graphix Studio Delivery & Operational Governance System

---

# Philosophy

Deployment is not “pushing code.”

Deployment is:

* Controlled change management
* Risk mitigation
* Reversible evolution
* Infrastructure governance

Nu Graphix Studio must deploy like a production-grade SaaS system — even while solo.

---

# 15️⃣ Environment Architecture (Strict Isolation)

Clear environment boundaries prevent catastrophic mistakes.

---

## Environments

### 1️⃣ Local

Purpose:

* Development
* Debugging
* Feature building

Rules:

* `.env.local`
* Debug logs enabled
* Sentry disabled or sandboxed
* Uses local DB or Neon branch DB
* Can use verbose logging

Never:

* Connect to production DB
* Use production secrets

---

### 2️⃣ Staging (Dev)

Purpose:

* Integration testing
* Migration validation
* Pre-production validation

Rules:

* Deployed from `dev` branch
* Connected to staging DB
* Sentry enabled (staging project)
* Debug logs structured but not verbose
* Not indexed by search engines
* Public URL but non-promoted

Staging is mandatory before production release.

---

### 3️⃣ Production

Purpose:

* Public live environment

Rules:

* Deployed from `main`
* Production DB only
* Debug logs disabled
* Structured logs only
* Sentry production project active
* Backups verified
* CSP enforced
* Rate limiting enforced

Production must never be used for experimentation.

---

## Environment Isolation Rules

* Production secrets never stored locally.
* Staging DB never reused for production.
* Migrations tested in staging first.
* Each environment has its own:

  * DB URL
  * Auth secret
  * Email API key
  * Sentry DSN
  * Turnstile secret
* No cross-environment environment variable reuse.

---

# 16️⃣ CI Pipeline (Mandatory Quality Gate)

Every push to `dev` or `main` must trigger CI.

No manual bypass.

---

## Required Checks

* TypeScript compile
* ESLint
* Build
* Unit tests (if applicable)
* Schema validation
* Migration integrity check (if applicable)

Failure = blocked deployment.

---

## CI Pipeline Structure

On push:

1. Install dependencies
2. Run typecheck
3. Run lint
4. Run tests
5. Build application
6. If branch = `dev` → deploy to staging
7. If branch = `main` → deploy to production

---

## Branch Protection Rules

* `main` is protected
* PR required
* CI must pass
* No force pushes
* No direct commits
* Required status checks enabled

---

# 17️⃣ Database Migration Discipline (Drizzle)

This is the highest risk layer.

---

## Migration Rules (Locked)

* Never edit old migration files.
* Always generate new migration.
* Migrations must be:

  * Deterministic
  * Ordered
  * Safe to apply once
* Avoid destructive changes without fallback.
* All migrations tested in staging.

---

## Migration Workflow (Strict)

1. Modify schema
2. Generate migration
3. Apply locally
4. Verify locally
5. Push to `dev`
6. Staging deploy runs migration
7. Validate staging data integrity
8. Create release PR
9. Merge to `main`
10. Production migration runs automatically

Never:

* Manually run SQL in production console.
* Skip staging validation.

---

## Pre-Production Migration Checklist

* [ ] Backup verified
* [ ] Unique constraints validated
* [ ] Indexes created
* [ ] No accidental data drops
* [ ] Large table changes benchmarked
* [ ] Rollback plan defined

---

# 18️⃣ Release Discipline (Structured Change Management)

---

## Release Types (Semantic Versioning)

### Patch (0.1.1)

* Bug fixes
* No schema changes
* No breaking behavior

### Minor (0.2.0)

* New feature
* Backward compatible
* May include safe schema additions

### Major (1.0.0)

* Breaking changes
* Schema modifications
* Behavior contract changes

---

## Release Workflow (Locked)

1. Merge feature branches into `dev`
2. Test staging thoroughly
3. Create release PR (`dev → main`)
4. Review diff
5. Merge
6. CI deploys to production
7. Execute smoke test
8. Monitor Sentry + logs

No skipping steps.

---

## Release Notes Requirements

Each release must document:

* What changed
* Schema changes
* New environment variables (if any)
* Security impact
* Observability changes
* Rollback strategy
* Version tag

---

# 19️⃣ Rollback Strategy (Realistic & Tested)

Rollback is a planned operation.

---

## Application Rollback

* Redeploy last stable tagged commit
* Confirm migration compatibility
* Re-run smoke tests
* Verify Sentry noise stabilized

---

## Database Rollback

Prefer:

* Restore from verified backup

If reversible migration exists:

* Apply reverse migration

Never:

* Patch DB manually in production without documented migration
* Modify data without postmortem entry

---

# 20️⃣ Monitoring & Observability Governance

Security without monitoring is illusion.

---

## Logging Requirements (Reinforced)

All mutations log:

* userId
* feature
* action
* result
* errorCode
* executionTime
* timestamp

Logs must:

* Be structured JSON
* Be environment-aware
* Avoid PII
* Avoid secrets

---

## Sentry Governance

Must capture:

* Unhandled exceptions
* Server function crashes
* Performance traces
* Release version tagging

Alert triggers:

* 5xx spike above baseline
* Auth failure spike
* Contact form failure spike
* DB connectivity issues
* ServerResult INTERNAL spike

---

# 21️⃣ Deployment Safety Checklist (Production Gate)

Before release:

* [ ] CI green
* [ ] Types clean
* [ ] Lint clean
* [ ] Staging verified
* [ ] Migrations validated
* [ ] Rate limiting active
* [ ] Turnstile active
* [ ] Email functional
* [ ] Sentry active
* [ ] Env vars verified
* [ ] Backup confirmed
* [ ] Smoke test plan ready

After deployment:

* [ ] Login works
* [ ] Admin dashboard loads
* [ ] Blog loads
* [ ] Post publish works
* [ ] Contact form works
* [ ] No unexpected errors in logs
* [ ] Sentry quiet

---

# 22️⃣ Version Tagging Strategy

All production deployments must be tagged.

Format:

* `v0.1.0`
* `v0.2.0`
* `v1.0.0`

Rules:

* Patch increments third number
* Minor increments second number
* Major increments first number

Tag after production deployment is verified.

Never tag before validation.

---

# 23️⃣ Change Governance Rules

* No Friday night production deploys.
* No deploys under emotional pressure.
* No refactors bundled into feature release.
* No migration + refactor + feature in same PR.
* No skipping staging.

---

# 24️⃣ Deployment Principles (Finalized)

1. CI is law.
2. Staging is mandatory.
3. Migrations are sacred.
4. Logging is required.
5. Rollback is defined before release.
6. Observability must be active.
7. Versioning must be consistent.
8. Production is infrastructure.
9. No manual console fixes.
10. Discipline scales a solo founder.

---

# Phase 6 Outcome

After refinement:

* Environment isolation is strict.
* CI pipeline enforces discipline.
* Migrations are controlled.
* Releases are versioned.
* Rollback is realistic.
* Monitoring is formalized.
* Production governance is hardened.
* Change management is structured.

---