# `src/lib/errors` Reference

## Purpose

`src/lib/errors` defines the shared error model used by server functions and
UI-facing result contracts.

## Files

- `src/lib/errors/server-result.ts`: `ServerResult<T>` model and helpers.
- `src/lib/errors/app-error.ts`: typed application error class.
- `src/lib/errors/to-server-fail.ts`: unknown error to `ServerFail` converter.
- `src/lib/errors/safe-action-error.ts`: safe user-facing action error mapping.
- `src/lib/errors/index.ts`: barrel export.

## Core Contract

`ServerResult<T>` remains:

- `{ ok: true; data: T }`
- `{ ok: false; error: { code, message, fieldErrors? } }`

Error codes:

- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `CONFLICT`
- `RATE_LIMITED`
- `INTERNAL`

## Hardened Behaviors

- Zod validation failures are flattened into structured field errors.
- `AppError` preserves typed code + optional field errors + optional cause.
- Known message patterns map to non-`INTERNAL` error codes.
- Unknown/untrusted errors degrade to safe `INTERNAL` messages.
- Result type guards are available for safer narrowing:
  - `isServerOk`
  - `isServerFail`
  - `isServerResult`

## Usage Rule

Server functions should return `ServerResult<T>` for business failures and only
throw framework control signals (`redirect`, `notFound`, `Response`).
