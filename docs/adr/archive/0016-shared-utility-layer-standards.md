# ADR-0016: Shared Utility Layer Standards

**Status:** Accepted  
**Date:** 2026-02-17

## Context

`src/lib/utils` is a high-reuse boundary. Small defects in utility behavior can
cascade through UI composition, content paths, and user-facing actions.

Existing utility implementations were functional but not hardened for edge
cases (diacritics, empty input, blocked popup behavior, clipboard fallback).
ADR-0012 also requires us to avoid turning shared utilities into a business
logic dumping ground.

## Decision

Define and enforce utility standards:

1. **Deterministic outputs** for identical inputs.
2. **Explicit options for behavior tuning** (fallbacks, limits), avoiding hidden
   assumptions.
3. **SSR-safe browser guards** for `window`/`navigator`/`document` usage.
4. **No feature/domain logic in shared utilities**; only cross-cutting helpers.

Apply this standard to current utilities by:

- hardening `generateSlug` with normalization, fallback, and max-length control,
- hardening `getInitials` for blank/email/multi-part cases,
- hardening social-share helpers with popup and clipboard fallbacks.

## Consequences

### Positive

- Utility behavior is predictable in production and easier to test.
- Browser/API variance causes fewer runtime failures.
- Shared utility surface stays disciplined and architecture-aligned.

### Trade-offs

- Utility APIs become slightly richer (options objects), requiring small usage
  awareness by consumers.
