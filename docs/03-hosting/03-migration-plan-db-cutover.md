# DB Migration and Cutover Plan

Last updated: 2026-02-18
Status: Draft

## Goal

Define reversible DB cutover with minimal downtime and clear rollback.

## Plan Stages

1. Pre-migration prep (schema compatibility, backups, dry runs).
2. Dual validation window (new DB compared against baseline reads).
3. Cutover execution window.
4. Post-cutover validation.
5. Rollback protocol.

## Checklist

- [ ] Data consistency checks defined.
- [ ] Write freeze/maintenance approach defined (if needed).
- [ ] Rollback triggers and owners defined.
- [ ] Communication template prepared.

## Validation

- [ ] Smoke tests pass after cutover.
- [ ] Latency baseline improved vs pre-cutover.
- [ ] Error rate unchanged or improved.