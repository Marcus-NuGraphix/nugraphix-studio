# Phased Execution Plan (0-8)

Last updated: 2026-02-18
Status: Active

## Phase 0 - Baseline and Docs Governance

### Goal

Establish a reliable baseline and docs system of record.

### Scope

- `docs/00-index.md`
- `docs/01-audit/*`
- `docs/08-implementation/*`
- docs index/plan files

### Tasks

- [x] Complete audit map and risk register.
- [x] Capture quality gate baseline.
- [x] Normalize stale docs pointers and active plan links.

### Verification

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

### Exit Criteria

- Baseline facts recorded and top blockers prioritized.

## Phase 1 - Local Environment Hardening

### Goal

Reliable local dev via Docker Desktop.

### Scope

- `docker-compose.yml`
- `.env.example`
- `docs/02-environments/01-local-dev-docker.md`
- migration/seed scripts

### Tasks

- [ ] Validate required local services only.
- [ ] Ensure deterministic migration + seed.
- [ ] Document troubleshooting flow.

### Verification

- Fresh clone setup succeeds in <= 15 minutes.

### Exit Criteria

- New developer can run stack without guesswork.

## Phase 2 - Production-Dev Runtime on VM

### Goal

Predictable containerized runtime and deploy flow.

### Scope

- Dockerfile/runtime scripts
- `docs/02-environments/02-prod-dev-docker-vm.md`
- health/logging integration points

### Tasks

- [ ] Build production image.
- [ ] Add health/readiness checks.
- [ ] Define migration-on-deploy strategy.

### Verification

- Containerized app runs with production-like env locally/VM.

### Exit Criteria

- Deployment runbook is repeatable and validated.

## Phase 3 - Hosting and Latency Decision

### Goal

Choose DB/app region strategy using measured evidence.

### Scope

- `docs/03-hosting/*`
- latency instrumentation and benchmark scripts

### Tasks

- [ ] Benchmark baseline and candidates.
- [ ] Decide target hosting model.
- [ ] Finalize cutover + rollback plan.

### Verification

- Before/after latency tables complete.

### Exit Criteria

- Signed-off hosting decision with migration path.

## Phase 4 - Design System and `lib` Foundation Expansion

### Goal

Scale component system and shared library boundaries safely.

### Scope

- `src/components/*`
- `src/features/*/ui/*`
- `src/lib/*`
- `docs/04-design-system/*`

### Tasks

- [ ] Complete component audit and prioritization.
- [ ] Standardize conventions and token usage.
- [ ] Expand `lib` with strict boundaries (`env`, `config`, `constants`, `logging`, `errors`, `validation`, `permissions`, `api`, `db`, `flags`, `cache`).

### Verification

- Lint/typecheck/tests/build pass for changed scope.
- No boundary regressions or circular dependency introduction.

### Exit Criteria

- Design system and `lib` conventions are documented and enforced in high-churn paths.

## Phase 5 - Dashboard Workspaces Refactor

### Goal

Introduce clean, scalable workspaces in admin dashboard.

### Scope

- `src/routes/admin/*`
- `src/components/layout/*`
- `src/components/navigation/*`
- `docs/05-dashboard/*`

### Tasks

- [ ] Implement workspace IA and routing.
- [ ] Add role-driven menus and switcher UX.
- [ ] Enforce permissions at route + server levels.

### Verification

- Unauthorized deep links denied.
- Navigation renders correctly per role.

### Exit Criteria

- Workspaces are discoverable, enforceable, and scalable.

## Phase 6 - Auth and Security Hardening

### Goal

Close critical auth/security gaps.

### Scope

- `src/features/auth/*`
- security-sensitive server functions/routes
- `docs/06-security/*`

### Tasks

- [ ] Execute auth hardening checklist.
- [ ] Validate CSRF/CORS/session/rate-limit posture.
- [ ] Add missing regression tests for security-critical flows.

### Verification

- Privilege escalation attempts fail.
- Auth/session regression suite passes.

### Exit Criteria

- Security checklist high/critical items resolved or risk-accepted with owner/date.

## Phase 7 - Repo Polish and CI Discipline

### Goal

Production-ready quality and release workflow.

### Scope

- CI config
- test/build scripts
- `docs/07-quality/*`

### Tasks

- [ ] Enforce minimal CI quality gates.
- [ ] Standardize scripts and onboarding expectations.
- [ ] Finalize release-readiness checklist.

### Verification

- CI green on target branch.
- Release smoke tests documented and executed.

### Exit Criteria

- Repo can be onboarded, validated, and deployed consistently.

## Phase 8 - Final Readiness Review

### Goal

Confirm end-to-end production readiness and docs completeness.

### Scope

- all docs tracks
- deployment + rollback runbooks
- final audit snapshot

### Tasks

- [ ] Run full outside-in audit.
- [ ] Close or explicitly defer remaining risks.
- [ ] Publish final readiness report.

### Verification

- Audit report includes findings, fixes, and verification evidence.

### Exit Criteria

- Team has a clear, documented, verifiable production operating baseline.
