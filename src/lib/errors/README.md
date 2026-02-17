# Error Layer

This directory owns shared error primitives and server failure mapping.

## Responsibilities

1. Define the application error taxonomy (`AppError` and domain-safe variants).
2. Provide `ServerResult` success/failure helpers.
3. Convert unknown runtime errors into safe user-facing `ServerFail` responses.

## Files

1. `app-error.ts`: typed application error base and error codes.
2. `safe-action-error.ts`: safe-action compatible error messaging helpers.
3. `server-result.ts`: `ServerResult` + helpers for consistent server function contracts.
4. `to-server-fail.ts`: converter from thrown errors to standardized server failures.
5. `index.ts`: public barrel export.
