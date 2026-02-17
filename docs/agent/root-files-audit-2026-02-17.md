# Root Files Audit — 2026-02-17

## Scope
- Root/top-level repository configuration and governance files.
- Toolchain health checks: lint, typecheck, test, build.
- Consistency against repo contracts (`AI.md`, `ARCHITECTURE.md`) and current framework docs.

## Skills + Documentation Used
- `Context7` skill:
  - ESLint v9 flat config ignore behavior (global ignores should be in a standalone object, or use `globalIgnores`).
  - TanStack Start docs for Vite plugin ordering and `createServerFn` validation API (`.inputValidator(...)` is valid/current).
- `tanstack-start-best-practices` skill:
  - Route protection (`beforeLoad`) and server function input validation checks.
- `security-owasp` skill:
  - Validation/secret-handling review for root/env/config surfaces.

## Checks Run
- `pnpm lint:fix` ✅
- `pnpm lint` ✅
- `pnpm typecheck` ❌
- `pnpm test` ❌
- `pnpm build` ✅ (with dependency warnings)

## Findings (Ordered by Severity)

1. **High: Typecheck is failing (build gate not healthy).**
- `src/features/auth/server/rate-limit.ts:1`
- `src/features/contact/index.ts:16`
- `src/features/contact/index.ts:17`
- `src/features/contact/index.ts:18`
- `src/features/contact/index.ts:19`
- `src/routes/_auth/reset-password/index.tsx:25`
- Impact: CI cannot pass because `typecheck` job fails.

2. **High: Test suite has failing/stale tests tied to old schema paths.**
- `src/lib/db/tests/schema-contracts.test.ts:12`
- `src/lib/db/tests/schema-contracts.test.ts:90`
- `src/lib/db/tests/schema-contracts.test.ts:91`
- `src/lib/db/tests/schema-contracts.test.ts:112`
- Impact: CI `test` gate fails; tests are asserting previous folder structure/contracts.

3. **High: Security/documentation drift for protected admin area.**
- `ARCHITECTURE.md:62` (states admin route has auth guard)
- `ARCHITECTURE.md:226` (states `/admin` guarded by `beforeLoad`)
- `src/routes/admin/route.tsx:3` (no `beforeLoad` present)
- Impact: architecture contract says protected route; implementation currently not enforcing route-level guard.

4. **Medium: Server function contract docs drift from current TanStack API usage.**
- `AI.md:25` (`.validator(schema)` requirement)
- `AI.md:39` (example uses `.validator`)
- Actual usage across codebase uses `.inputValidator(...)`, e.g. `src/features/contact/server/contact.ts:11`
- Impact: prompts/contracts can push contributors toward non-canonical repo patterns.

5. **Medium: Email provider contract mismatch across root config/docs/env.**
- `.env.example:40` (claims `sendgrid` supported)
- `.env.example:57` (`SENDGRID_API_KEY` present)
- `src/lib/env/server.ts:48` (`EMAIL_PROVIDER` only `'noop' | 'resend'`)
- `src/features/email/server/provider-registry.server.ts:7` (only resend/noop resolution)
- Impact: onboarding/config confusion and false assumptions about provider support.

6. **Medium: Node runtime version drift between local and CI.**
- `.nvmrc:1` (`22`)
- `.github/workflows/ci.yml:30` (`node-version: 20`)
- `.npmrc:1` (`engine-strict=true`)
- Impact: potential non-reproducible behavior across local/CI; harder debugging of version-specific issues.

7. **Medium: Root docs are stale vs current ADR and setup reality.**
- `README.md:69` (ADR range capped at 0010, repo now has 0014)
- `README.md:25` (env setup is too minimal for current env contract)
- Impact: onboarding friction and incorrect setup expectations.

8. **Medium: Dependency pinning risk in root manifest.**
- `package.json:43` (`"nitro": "latest"`)
- Impact: non-deterministic upgrades can break builds unexpectedly.

9. **Low: Minor TS config drift.**
- `tsconfig.json:7` references `vite.config.js` while repo uses `vite.config.ts`.
- Impact: low, but indicates stale config entry.

10. **Low: Example credentials in public template are too realistic.**
- `.env.example:33` (`MINIO_ROOT_PASSWORD=minioadmin`)
- `.env.example:70` (`SEED_ADMIN_PASSWORD=DevLord!420`)
- `docker-compose.yml:31` default `minioadmin`
- Impact: acceptable for local-only defaults, but can be accidentally reused outside local.

11. **Low: Docs index references file currently deleted in working tree.**
- `docs/README.md:11` references `docs/weeks/week-00.md`
- Current git state includes deletion of `docs/weeks/week-00.md`.

## Fixes Applied in This Pass
- Resolved lint blocker from generated/auxiliary folders being linted:
  - Updated global ignore behavior in `eslint.config.js`.
- Removed `require-await` lint noise by making non-awaited repository functions non-`async`:
  - `src/features/users/server/repository.ts`
- Auto-fixed import ordering during lint fix:
  - `src/features/users/server/users.ts`
- Added audit sequencing doc:
  - `docs/agent/repo-audit-order.md`

## Recommended Next Fix Order
1. Repair typecheck errors (import/path drift + reset-password params typing).
2. Repair stale tests to current schema layout and auth runtime assumptions.
3. Add admin `beforeLoad` guard to align with architecture/security contract.
4. Reconcile docs/contracts: `AI.md`, `README.md`, env/provider reality.
5. Align Node versions between `.nvmrc` and CI.
6. Pin `nitro` to a stable version.
