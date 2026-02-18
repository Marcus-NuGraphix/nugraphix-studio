# Phase 06 - Release and Deployment Discipline

Status: Active
Last updated: 2026-02-18

## Objective

Ship Blog MVP through controlled staging and production release flow.

## Release Controls

- [ ] Local checks complete (`lint`, `typecheck`, `test`, `build`).
- [ ] Staging verification complete before production merge.
- [ ] Migration verification complete before release (if schema changes).
- [ ] Production smoke tests executed after deployment.

## Smoke Test Checklist (Blog MVP)

- [ ] Admin login and dashboard access.
- [ ] Create post draft.
- [ ] Edit and publish post.
- [ ] Public blog list includes published post only.
- [ ] Public blog slug route renders correctly.
- [ ] Unpublish/archive behavior removes post from public list.

## Operational Controls

- [ ] Sentry and structured logs monitored post-deploy.
- [ ] Rollback path defined before release.
- [ ] Release notes include schema and behavior changes.

## Exit Criteria

Blog MVP has a verified release path and repeatable deployment playbook.
