# ADR-0005: Observability & Logging Strategy

- Status: Accepted
- Date: 2026-02-17
- Decision Owners: Nu Graphix (Marcus)
- Related: Phase 4 Security, Phase 5 Debug Protocol, Phase 6 CI/CD

## Context

Nu Graphix Studio must:

- Detect errors early
- Diagnose issues quickly
- Monitor production stability
- Avoid silent failures

Observability must be structured and scalable.

## Decision

### Error Tracking
- Sentry

### Logging Strategy
- Structured JSON logs for all mutations

Required log fields:
- feature
- action
- userId
- result
- errorCode
- executionTime
- timestamp

### Log Levels
- INFO → normal success
- WARN → validation/permission failure
- ERROR → unexpected failure

### Privacy Rules
Never log:
- passwords
- tokens
- secrets
- full email bodies
- raw content_json

### Release Tracking
- All production releases tagged
- Sentry release tagging enabled

## Alternatives Considered

1) Console-only logging
- Rejected: insufficient for production diagnostics.

2) Self-hosted observability stack
- Rejected for MVP: operational overhead too high.

## Consequences

### Positive
- Production visibility
- Structured debugging discipline
- SaaS-ready logging model
- Early anomaly detection

### Trade-offs / Risks
- Must maintain log hygiene
- Sentry DSN must remain secure

## Follow-ups

- Implement `lib/observability/logger.ts`
- Integrate Sentry before first production deploy
