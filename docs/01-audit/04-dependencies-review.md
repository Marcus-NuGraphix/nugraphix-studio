# Dependencies Review

Last updated: 2026-02-18
Status: Draft

## Goal

Audit dependency health and remove unnecessary risk without adding new libraries.

## Checklist

- [x] Inventory direct dependencies and map to feature use.
- [ ] Flag unused dependencies.
- [x] Check for known vulnerabilities and risky transitive packages.
- [x] Confirm pinned/runtime-critical versions (TanStack, Better Auth, Drizzle, Vite).
- [x] Validate no dependency bypasses established contracts.

## Output Table

| Package | Why It Exists | Risk | Action | Owner | Phase |
| --- | --- | --- | --- | --- | --- |
| `fast-xml-parser@5.3.4` (transitive) | AWS SDK XML building internals (`@aws-sdk/client-s3` chain) | High (`GHSA-jmr7-xgp7-cmfj`) | Upgrade/override to patched version (`>=5.3.6`) and re-run `pnpm audit --prod` | Eng | 0 |
| `esbuild@0.18.20` (transitive dev chain) | `drizzle-kit`/`@esbuild-kit/*` toolchain path | Moderate advisory; dev-server exposure context-dependent | Track upstream toolchain updates and verify actual exploitability in local-only dev context | Eng | 0-1 |
| TanStack core packages (`@tanstack/react-start`, router/plugin set) | Framework/runtime | Patch/minor lag from latest | Evaluate patch bump in controlled update wave after Phase 1 baseline | Eng | 2 |

## Verification Commands

- `pnpm audit --prod`
- `pnpm why <package>`
- `pnpm outdated`

## Command Results (2026-02-18)

- `pnpm audit --prod` -> `1 high`, `1 moderate`.
- `pnpm why fast-xml-parser` -> vulnerable version pulled by AWS SDK dependency chain.
- `pnpm why esbuild` -> vulnerable dev chain appears under `drizzle-kit` transitive tooling.
- `pnpm outdated` -> core framework patch/minor updates available.
