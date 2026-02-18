# Dependencies Review

Last updated: 2026-02-18
Status: Draft

## Goal

Audit dependency health and remove unnecessary risk without adding new libraries.

## Checklist

- [ ] Inventory direct dependencies and map to feature use.
- [ ] Flag unused dependencies.
- [ ] Check for known vulnerabilities and risky transitive packages.
- [ ] Confirm pinned/runtime-critical versions (TanStack, Better Auth, Drizzle, Vite).
- [ ] Validate no dependency bypasses established contracts.

## Output Table

| Package | Why It Exists | Risk | Action | Owner | Phase |
| --- | --- | --- | --- | --- | --- |
| TBD |  |  |  |  |  |

## Verification Commands

- `pnpm audit --prod`
- `pnpm why <package>`
- `pnpm outdated`