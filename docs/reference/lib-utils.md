# `src/lib/utils` Reference

## Purpose

`src/lib/utils` provides deterministic, reusable cross-cutting helpers that do
not carry feature-specific business logic.

## Files

- `src/lib/utils/cn.ts`: class merge helper (`clsx` + `tailwind-merge`).
- `src/lib/utils/generate-slug.ts`: stable slug generation with fallback and
  length controls.
- `src/lib/utils/get-initials.ts`: robust initials extraction for names/emails.
- `src/lib/utils/social-share.ts`: SSR-safe sharing helpers and clipboard
  utility.
- `src/lib/utils/index.ts`: utility barrel export.

## Standards

- Utilities must remain deterministic for identical inputs.
- Utilities may include options objects for explicit behavior control.
- Browser-only APIs (`window`, `navigator`, `document`) must be gated so module
  import remains SSR-safe.
- Do not place domain/business rules in `src/lib/utils`.

## Current Hardened Behaviors

- `generateSlug(...)`
  - ASCII normalization for accented text.
  - separator cleanup and edge trimming.
  - fallback slug when input normalizes to empty.
  - configurable max length.

- `getInitials(...)`
  - handles whitespace-only input with fallback.
  - handles email-like identifiers.
  - configurable `maxInitials` with guardrails.

- `social-share.ts`
  - popup fallback when blocked.
  - whitespace-normalized share text.
  - clipboard fallback for older browsers.
  - guarded native share support checks.
