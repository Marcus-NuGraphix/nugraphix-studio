# Audits

Last updated: 2026-02-18

## Canonical Files

- `docs/audits/repo-audit-order.md` - outside-in audit execution order.
- `docs/audits/2026-02-18-docs-consolidation-baseline.md` - historical baseline snapshot from prior docs consolidation pass.
- `docs/audits/2026-02-18-phase-05-incident-enforcement.md` - Phase-05 incident enforcement snapshot.
- `docs/audits/2026-02-18-production-hardening-docs-scaffold.md` - production-readiness docs-first scaffold baseline and stale-reference cleanup.
- `docs/audits/2026-02-18-phase-0-repo-audit.md` - Phase 0 outside-in repo audit with severity-ranked findings and fix order.
- `docs/audits/2026-02-18-phase-1-local-env-validation.md` - Phase 1 local Docker/runtime validation with migration-chain drift findings.
- `docs/audits/2026-02-18-fast-xml-parser-mitigation.md` - targeted dependency audit showing closure of high `fast-xml-parser` advisory.

## Audit Cadence

- Run full outside-in audit before release candidates.
- Run targeted audit for each major feature area after large implementation waves.
- Store snapshots as `YYYY-MM-DD-<scope>.md`.

## Reporting Contract

Every audit report should include:

1. Scope
2. Findings by severity (`critical`, `high`, `medium`, `low`)
3. File references for each finding
4. Recommended fix order
5. Verification commands
