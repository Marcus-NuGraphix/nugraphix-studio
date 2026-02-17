# PHASE 5 — ERROR MANAGEMENT SYSTEM

## Nu Graphix Debug, Failure & Incident Protocol

---

# Philosophy

Nu Graphix Studio is not allowed to be “debugged emotionally.”

Debugging must be:

* Structured
* Observable
* Reversible
* Documented
* Repeatable

Phase 5 ensures:

* Failures improve the system
* AI mistakes compound into rules
* Production remains controlled
* Solo development remains disciplined

---

# 10️⃣ Debug Protocol (Systematic, Not Emotional)

## Purpose

Prevent:

* Blind AI retries
* Guess-based changes
* Thrashing architecture
* Scope creep during debugging
* “It works now, don’t touch it” fixes

Debugging must generate clarity, not chaos.

---

# The Nu Graphix 3-Failure Rule (Locked)

Escalate to structured debugging when:

* 3 failed AI attempts
* OR 30 minutes of manual debugging
* OR 3 blind code changes
* OR repeated regression

No exceptions.

---

# Structured Debug Workflow

---

## Step 1 — Freeze

* Stop changing code.
* Commit current state or revert to last known working commit.
* Do not continue experimenting.

If production is affected:

* Create `hotfix/<issue>` branch immediately.

---

## Step 2 — Define the Problem Precisely

Write explicitly:

* Expected behavior
* Actual behavior
* Reproduction steps
* Environment (local / staging / prod)
* Frequency
* Recent changes
* Related logs
* Error codes returned (ServerResult code)

Ambiguity is forbidden.

---

## Step 3 — Classify the Layer

Before involving AI, determine which layer likely contains the issue:

* UI rendering
* Form logic
* Server function validation
* Auth/role enforcement
* DB query logic
* Search index
* Rate limiting
* Email integration
* Environment configuration
* Deployment/migration
* Observability misconfiguration

This prevents cross-layer thrashing.

---

## Step 4 — Ask AI for Suspects (Not Fixes)

Prompt must request:

* Top 5 likely root causes
* Where to add logs
* What signal confirms each suspect
* Which ServerResult code should appear

Explicit constraint:

> Do not rewrite architecture. Diagnose only.

AI diagnoses. It does not rewrite.

---

## Step 5 — Add Targeted Logs

Add logs only at suspect boundaries.

Log:

* Raw input
* Parsed Zod result
* Auth state
* Role
* DB query result
* Returned ServerResult
* Error code
* Execution timing

Never log:

* Passwords
* Tokens
* Secrets
* Raw content_json
* Email bodies

---

## Step 6 — Confirm via Logs

Provide logs to AI:

Ask:

* Which suspect confirmed?
* Which eliminated?
* What exact minimal fix required?
* Is this root cause or symptom?

---

## Step 7 — Apply Single Fix

Rules:

* Fix only confirmed cause
* Do not refactor
* Do not optimize
* Do not “clean up unrelated things”
* Retest exact reproduction steps

---

## Step 8 — Regression Check

After fix:

* Re-run reproduction steps
* Verify other related flows
* Verify no new ServerResult codes appear
* Check logs for new warnings
* Confirm no performance degradation

---

# Root Cause Classification (Mandatory)

After resolution, classify issue:

* Validation missing
* Role check missing
* Incorrect ServerResult mapping
* Rate limit misfire
* Race condition
* N+1 query
* Search index stale
* AI hallucination
* Human logic flaw
* Environment misconfiguration
* Migration mismatch
* Deployment pipeline issue

Add classification to AI Mistakes Log.

---

# 11️⃣ AI Mistakes Log (Project-Level)

Location:

```
/docs/ai-mistakes.md
```

This is mandatory documentation infrastructure.

---

## Required Structure

```
Date:
Feature:
Phase:
Environment: local/staging/production

Mistake:
What AI or human did wrong

Root Cause:
Technical reason

Detection Signal:
How to identify early

Prevention Rule:
New constraint added to prompt or checklist

Severity:
Low / Medium / High
```

---

## Log Hygiene Rule

Every recurring issue must produce:

* A new checklist rule
* A new AI constraint
* A new validation pattern
* Or a new test

If it happens twice, it becomes architecture.

---

# 12️⃣ Production Incident Protocol (Expanded)

Nu Graphix Studio must behave like production infrastructure.

---

# Severity Levels

## S1 — Critical

Examples:

* Auth broken
* Admin lockout
* Data corruption
* Site down
* Sensitive data leak
* DB migration failure

Action:

* Immediate hotfix branch
* Disable affected feature if necessary
* Deploy fix
* Document postmortem within 24h
* Verify backups if DB related

---

## S2 — Major

Examples:

* Admin feature unusable
* Email failing
* Contact form broken
* Search broken

Action:

* Fix within 24h
* Structured debugging
* Add regression test

---

## S3 — Minor

Examples:

* Styling bug
* Non-blocking UI issue
* Minor console warning

Action:

* Backlog item
* Fix in next sprint

---

# Incident Response Timeline

1. Identify severity
2. Freeze deploys
3. Create hotfix branch
4. Structured debugging
5. Deploy
6. Validate
7. Write postmortem
8. Update AI Mistakes Log

---

# Postmortem Template (Mandatory for S1)

```
Incident:
Date:
Severity:

Impact:
Who was affected?

Detection:
How was it discovered?

Root Cause:
Precise technical explanation

Why Not Caught:
Missing validation?
Missing test?
Missing review?

Fix Implemented:

Preventative Change:
New rule, test, or constraint

Follow-Up Tasks:
```

---

# 13️⃣ Logging Discipline (Aligned with Phase 4)

All mutation logs must include:

* userId
* feature
* action
* result
* errorCode
* executionTime
* timestamp

Log levels:

* INFO → normal success
* WARN → validation failure
* ERROR → unexpected failure

Never log:

* Credentials
* Secrets
* Full payloads
* Raw request bodies

---

# 14️⃣ Environment-Specific Debug Rules

---

## Local

* Add temporary verbose logs
* Allow stack traces
* Enable debug mode

---

## Staging

* Logs enabled
* Validate migrations
* No verbose sensitive logging

---

## Production

* No debug logs
* Only structured logs
* Errors mapped to INTERNAL
* Sentry captures stack trace
* Never expose stack traces in UI

---

# 15️⃣ Deployment Rollback Protocol

If production issue discovered:

* Identify last stable tag
* Revert to previous deployment
* Disable problematic feature if needed
* Restore DB only if absolutely required
* Document rollback cause

Rollback is controlled, not panic-driven.

---

# 16️⃣ Regression Prevention Protocol

Every bug must trigger one of:

* New Zod validation
* New role check
* New structured log
* New constraint in AI prompts
* New test (if applicable)
* New checklist item

If a bug reoccurs → protocol failed.

---

# 17️⃣ Nu Graphix Debug Principles (Finalized)

1. Never guess.
2. Observe before changing logic.
3. AI diagnoses before implementing.
4. One fix at a time.
5. Logs are truth.
6. Errors improve architecture.
7. Rollback is strength.
8. Every failure produces a rule.
9. Production is sacred.
10. Discipline scales a solo founder.

---