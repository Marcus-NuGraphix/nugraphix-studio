# ADR-0024: Security and Quality Gate Enforcement

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0010, ADR-0012, ADR-0017, ADR-0023

## Context

Phase 04 required explicit security and quality controls after Blog MVP
baseline delivery.

The codebase already had strong patterns, but we needed formal enforcement for:

1. Mutation validation coverage guarantees.
2. Public write-path rate limiting completeness.
3. Non-HTML rich-text rendering safety verification.
4. Secret redaction coverage for sensitive log fields.
5. Deterministic contract checks for blog authorization and publish-state rules.

## Decision

Adopt enforcement-by-contract with targeted runtime hardening.

1. **Public write hardening**
   - Add rate limiting to unsubscribe token mutations.
   - Use token fingerprinting (`sha256` prefix) for limiter keys instead of raw
     tokens.

2. **Security contract tests**
   - Add feature-level contract tests to ensure:
     - deterministic slug conflict mapping (`CONFLICT`) in blog lifecycle flows,
     - published-only access contracts for public blog reads,
     - control-signal rethrow patterns remain intact.
   - Add cross-feature contract test to ensure all `POST` server functions keep
     `.inputValidator(...)` in the server function chain.

3. **Rendering safety verification**
   - Add explicit test coverage proving script-like text from rich content is
     escaped in public rendering output (no raw HTML injection path).

4. **Observability redaction assurance**
   - Extend logger test coverage for `authorization` and `cookie` field redaction.

## Consequences

### Positive

1. Phase-04 controls are now enforceable and regression-resistant.
2. Public unsubscribe mutation no longer permits unthrottled token probing.
3. Log safety guarantees are backed by direct tests for auth-related headers.
4. Blog security posture is validated both at runtime behavior and source
   contract level.

### Trade-offs

1. Contract tests rely partly on source-shape assertions, which require updates
   if server function style conventions evolve.
2. Additional security tests increase maintenance surface and CI runtime slightly.

## References

- ProseKit quick start:
  `https://prosekit.dev/getting-started/quick-start/`
- ProseKit styling:
  `https://prosekit.dev/getting-started/styling/`
- ProseKit saving/loading:
  `https://prosekit.dev/getting-started/saving-and-loading/`
- ProseKit extensions:
  `https://prosekit.dev/getting-started/using-extensions/`
- ProseKit components:
  `https://prosekit.dev/components/`
