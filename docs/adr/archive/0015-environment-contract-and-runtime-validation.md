# ADR-0015: Environment Contract and Runtime Validation

**Status:** Accepted  
**Date:** 2026-02-17

## Context

`src/lib/env/server.ts` already provided basic Zod parsing, but production
readiness required:

1. stronger coercion/default behavior,
2. cross-field provider/security validation, and
3. deterministic startup diagnostics without leaking secret values.

The environment layer is a cross-cutting infrastructure boundary under
ADR-0012, so contract quality here directly impacts auth, database, email, and
background task reliability.

## Decision

Adopt a strict runtime env contract with:

1. **Single canonical parser** (`parseServerEnv`) for typed env loading.
2. **Lazy cached access** via `getServerEnv()` and `env` proxy.
3. **Cross-field constraints**, including:
   - `EMAIL_PROVIDER=resend` requires `RESEND_API_KEY`.
   - reCAPTCHA site/secret keys must be configured together.
   - production requires either `BACKGROUND_TASKS_DRAIN_SECRET` or
     `CRON_SECRET`.
4. **Constrained numeric validation** for `RECAPTCHA_MIN_SCORE` (`0..1`).
5. **Structured parse errors** with formatted issue output and no secret values.
6. **Testability hook**: `resetServerEnvCacheForTests()`.

## Consequences

### Positive

- Misconfiguration is detected early with explicit remediation signals.
- Environment behavior is deterministic across local/staging/production.
- Email and anti-bot configuration drift is blocked at startup.

### Trade-offs

- Slightly stricter validation may reject previously tolerated partial configs.
- Runtime validation remains fail-fast by design; startup cannot proceed with an
  invalid contract.
