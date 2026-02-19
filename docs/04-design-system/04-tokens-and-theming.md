# Tokens and Theming

Last updated: 2026-02-18
Status: Baseline Complete

## Goal

Maintain one coherent semantic token system across light/dark themes and all
shared component surfaces.

## Baseline Result (2026-02-18)

- `src/styles.css` is aligned with token-first architecture:
  - semantic color vars in `:root` and `.dark`
  - `@theme inline` token mapping
  - base layer uses semantic classes
- No raw Tailwind palette class drift detected in `src/components` and
  `src/features` from regex scans (`bg-red-500`, `text-blue-600`, etc.).
- Theme provider remains SSR-safe and cookie-driven in
  `src/components/theme/theme-provider.tsx`.

## Checklist

- [x] All semantic colors map to CSS variables.
- [x] No hardcoded Tailwind palette classes in shared/component surfaces.
- [x] Theme switching remains SSR-safe.
- [x] Status colors are semantically tokenized.

## Controlled Exceptions

| Path | Exception Type | Why It Exists | Planned Fix | Phase |
| --- | --- | --- | --- | --- |
| `src/features/email/server/template-tokens.ts` | Fixed email palette constants | Email rendering is outside Tailwind runtime and requires explicit inline-compatible values | Keep values centralized and semantic (`colors`, `spacing`, `typography`) | 4 |

## Drift Tracker

| Path | Drift Type | Fix | Status |
| --- | --- | --- | --- |
| `src/components/ui/chart.tsx` | Third-party selector literal | Switched to generic stroke selectors without hardcoded color values | Closed |
| `src/features/email/server/templates.server.tsx` | Inline color literals | Moved palette to `src/features/email/server/template-tokens.ts` | Closed |

## Guardrails

- Shared UI (`src/components/ui/*`, `src/components/*`) must not introduce new
  raw palette classes or hex literals without documented exception.
- Email template colors are treated as a separate rendering context and must use
  centralized constants from `src/features/email/server/template-tokens.ts`.
