# PHASE 4 — SECURITY & QUALITY

## Nu Graphix Security, Reliability & Production Standard

---

# Security Philosophy

Nu Graphix Studio is:

* A public-facing marketing platform
* An internal knowledge system
* A future SaaS foundation

Security is not a layer added later.
Security is part of architecture.

Security goals:

* No data leaks
* No privilege escalation
* No injection vulnerabilities
* No sensitive information exposure
* No silent failures
* No uncontrolled integrations

---

# 8️⃣ Security Checklist (Reusable & Enforced)

Every feature must pass this checklist before merging to `main`.

No exceptions.

---

# A) Data Security

---

## Validation (Mandatory)

All mutation inputs must:

* [ ] Be validated with Zod
* [ ] Use strict schema parsing (`safeParse`)
* [ ] Never trust client types
* [ ] Enforce enum constraints
* [ ] Validate slug format
* [ ] Validate UUID format
* [ ] Reject unexpected fields

Never:

* Use `any` for validated data
* Trust inferred types without runtime validation

---

## Rich Text Security (ProseKit Policy)

Because ProseKit stores structured content:

Storage:

* `content_json` only (ProseMirror)
* `content_text` for search

Rendering rules:

* No raw HTML injection
* No `dangerouslySetInnerHTML` without sanitization
* If HTML is ever generated, sanitize before render
* CSP must restrict inline script execution
* Links rendered must not allow `javascript:` protocols

Never allow user-supplied HTML bypass.

---

## Sanitization & Escaping

* [ ] All rendered content escaped properly
* [ ] Markdown or rich-text output sanitized
* [ ] No raw DB values rendered without escaping
* [ ] Drizzle parameterized queries only

SQL injection must be impossible by design.

---

## Ownership & Access Checks

Even single-tenant:

* [ ] No open mutation endpoints
* [ ] ID-based fetches validated
* [ ] Admin-only mutations require `requireAdmin()`
* [ ] No unfiltered `SELECT *`

Future SaaS readiness:

* Tables prepared for `orgId`
* Queries written in scoped manner (even if single-tenant)

---

## Row-Level Security (Future Activation)

Currently:

* App-level enforcement only

When multi-tenant activates:

* [ ] Enable RLS
* [ ] Enforce tenant policy
* [ ] Audit all queries
* [ ] Ensure no bypass via service roles

---

# B) Authentication & Authorization

---

## Better Auth Enforcement

* [ ] Auth instance centralized
* [ ] No duplicated session logic
* [ ] `requireUser()` for protected routes
* [ ] `requireAdmin()` for admin actions
* [ ] No role inference from client

---

## Role Enforcement Rules

* All role checks happen inside server functions
* UI restrictions are visual only
* Server decides permission

---

## Resource-Level Validation

For any entity mutation:

* [ ] Check existence
* [ ] Check permission
* [ ] Validate business rule
* [ ] Return correct error code

Error codes must match Phase 3 ServerResult contract.

---

# C) API & Server Function Hardening

Even though using server functions (not REST), treat them as API endpoints.

---

## Rate Limiting (Mandatory for Public Endpoints)

Required for:

* Contact form
* Login attempts
* Password reset
* Any future public write

Implementation:

* Cloudflare edge rate limiting
* Application-level limiter (`lib/rateLimit`)

Checklist:

* [ ] Login rate limited
* [ ] Contact rate limited
* [ ] RATE_LIMITED error code returned

---

## Bot Protection

Public forms must use:

* Cloudflare Turnstile
* Server-side token verification

Never trust client token without verification.

---

## CSRF Strategy

Because using cookie-based auth:

* SameSite cookies enabled
* POST-only mutations
* Validate origin header where applicable
* Do not allow cross-origin mutation calls

No unauthenticated mutation endpoints.

---

## Logging Standard

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
* raw email bodies

---

## Sensitive Error Control

* All unexpected errors mapped to `INTERNAL`
* No stack traces returned to client
* No raw DB error exposed
* Sentry captures real stack traces privately

---

# D) Secrets Management

---

## Environment Variables

* `.env` ignored
* No secrets committed
* Production secrets stored in hosting provider
* No logging of env vars

---

## Client Exposure Rules

Only expose:

* PUBLIC_ prefixed variables

Never expose:

* DB URL
* Auth secret
* SendGrid API key
* Sentry DSN (server-only where possible)
* Turnstile secret key

---

# E) Email Security (SendGrid)

* Email sending only via server functions
* No direct client API calls
* Validate email input format
* Rate limit contact form
* Log send attempt (success/failure)
* Never log full email body in production logs

---

# F) File Storage Security (Cloudflare R2)

* Signed upload URLs only
* Validate MIME type server-side
* Enforce file size limits
* No public write access
* Bucket access restricted

Future optional:

* Malware scanning

---

# 9️⃣ AI Code Review Workflow (Refined)

---

## Standard Security Review Process

1. Build feature
2. Run typecheck + lint
3. Self-review
4. AI Security Review
5. AI Performance Review
6. Manual reasoning pass
7. Merge

---

## AI Security Review Prompt (Locked)

Must check:

* Missing validation
* Missing role checks
* Injection risk
* Sensitive error leaks
* Rate limiting gaps
* Missing logging
* Unsafe rich text rendering
* Improper redirect usage

---

## AI Performance Review Prompt

Must check:

* N+1 queries
* Missing indexes
* Large payload responses
* Blocking synchronous logic
* Search inefficiencies
* Editor bundle size

---

# 10️⃣ Observability & Reliability

---

## Logging Strategy

Use structured logs only.

Format:

```
{
  feature,
  action,
  userId,
  result,
  errorCode,
  timestamp
}
```

---

## Sentry Requirements

Capture:

* Unhandled exceptions
* Server function crashes
* Performance traces
* Release version tagging

Alert on:

* Repeated 5xx spikes
* Auth failures surge
* Contact form failure surge

---

## Analytics Safety

* Analytics script must not block render
* No user PII sent
* Respect privacy

---

## Database Reliability

* [ ] Automated backups enabled
* [ ] Restore tested
* [ ] Unique constraints enforced
* [ ] Indexes on:

  * slug
  * search columns
  * foreign keys
* [ ] Migration tested in staging

---

# Deployment Safety Reinforcement

Before production:

* CI green
* Migration verified
* CSP verified
* Env vars validated
* Turnstile working
* Email working
* Sentry active

After production:

* Smoke test:

  * Login
  * Post creation
  * Contact form
  * Blog render
* Check logs for unexpected errors

---

# Phase 4 Principles (Finalized)

1. Validation before trust.
2. Server decides permissions.
3. Rich text is sanitized.
4. Public endpoints are rate limited.
5. All mutations logged.
6. Errors are shaped.
7. Secrets never leak.
8. Observability is mandatory.
9. No silent failures.
10. Production is treated as critical infrastructure.

---