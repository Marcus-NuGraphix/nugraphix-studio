# ADR-0017: Error Taxonomy and ServerFail Conversion

**Status:** Accepted  
**Date:** 2026-02-17

## Context

ADR-0008 and ADR-0010 established `ServerResult<T>` as the canonical business
result contract for server functions. To make that contract production-ready,
the shared error layer needed stronger consistency in:

1. typed error representation,
2. conversion from unknown runtime errors to safe fail payloads, and
3. utility functions for robust narrowing in consumers.

## Decision

Strengthen `src/lib/errors` as the canonical error boundary:

1. Keep the established `ServerResult<T>` union and existing code set.
2. Add shared `ServerError` typing and exported `serverErrorCodes`.
3. Add result type guards:
   - `isServerOk`
   - `isServerFail`
   - `isServerResult`
4. Harden `AppError` to preserve:
   - code,
   - field errors,
   - optional cause metadata.
5. Harden `toServerFail` conversion:
   - flatten Zod validation issues to field-level errors,
   - pass through `AppError`,
   - accept embedded server-fail-shaped objects,
   - map common known messages to non-`INTERNAL` codes,
   - degrade unknown errors to safe `INTERNAL` output.

## Consequences

### Positive

- Server function failure payloads become more consistent and predictable.
- UI/state layers can narrow result variants with less custom boilerplate.
- Validation and business errors are clearer without exposing unsafe internals.

### Trade-offs

- Message-based mapping requires discipline to avoid over-reliance on free-form
  error text.
