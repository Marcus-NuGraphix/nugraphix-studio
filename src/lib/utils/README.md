# Utilities Layer

Shared framework-agnostic helper utilities used across features.

## Responsibilities

1. Keep common formatting and transformation logic centralized.
2. Provide deterministic pure helpers where possible.
3. Keep UI/business-specific logic in feature modules, not in shared utils.

## Files

1. `cn.ts`: className merge utility.
2. `generate-slug.ts`: normalized slug generation helpers.
3. `get-initials.ts`: display initials helper.
4. `social-share.ts`: social share URL/text helpers.
5. `index.ts`: public barrel export.
