# Audit Snapshot - Phase 0 Repo Audit

Date: 2026-02-18
Scope: Outside-in Phase 0 audit (governance, toolchain, env contract, architecture drift, dependency risk).

## Findings

### Critical

- None.

### High

1. Production dependency chain includes vulnerable `fast-xml-parser`.
- Evidence: `pnpm audit --prod` (`GHSA-jmr7-xgp7-cmfj`), via `@aws-sdk/client-s3` chain.
- Files: `package.json`, `pnpm-lock.yaml`
- Action: patch dependency chain to `fast-xml-parser >= 5.3.6`, re-run audit.

### Medium

1. Phase 1 local environment verification blocked by Docker engine unavailable.
- Evidence: `docker compose up -d` failed (`open //./pipe/dockerDesktopLinuxEngine`).
- Files: `docker-compose.yml`
- Action: enforce Docker preflight in runbook and re-run local startup checks.

2. Admin docs phase route still points to legacy placeholder experience.
- Evidence: static placeholder copy in admin docs phases route.
- Files: `src/routes/admin/docs/phases/index.tsx`
- Action: replace with links to active docs system-of-record.

3. Seed workflow was not standardized (`db:seed` missing).
- Evidence: script list had only `db:seed:blog-demo`; docs expected `db:seed`.
- Files: `package.json`, `docs/02-environments/01-local-dev-docker.md`
- Action: add `db:seed` alias and align runbooks. (Completed in this pass.)

### Low

1. Build output warning volume is high and can hide actionable regressions.
- Evidence: `pnpm build` warning stream (`use client` directive noise / wasm fallback).
- Files: build output, dependency chain
- Action: classify/suppress expected warnings where safe.

2. Test run has Vitest shutdown timeout warning despite green results.
- Evidence: `pnpm test` warns about hanging-process reporter.
- Files: test runtime config
- Action: investigate teardown and hanging handles.

## Commands Executed

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm audit --prod`
- `pnpm outdated`
- `pnpm why fast-xml-parser`
- `pnpm why esbuild`
- `docker --version`
- `docker compose config`
- `docker compose up -d` (failed)
- `docker compose ps` (failed)
- `pnpm db:migrate` with local `DATABASE_URL` override (failed due no local DB)

## Recommended Fix Order

1. Patch high dependency vulnerability (`fast-xml-parser` chain) and re-audit.
2. Complete Docker engine preflight + local startup verification for Phase 1.
3. Finalize standardized seed path beyond blog demo data.
4. Replace admin docs phase placeholder with active docs links.
5. Reduce warning noise in build/test pipelines.
