# Release Readiness

Last updated: 2026-02-18
Status: Draft

## Goal

Standardize pre-release checks for containerized deployment.

## Checklist

- [ ] Quality gates green (`lint`, `typecheck`, `test`, `build`).
- [ ] Migration plan reviewed and rollback path defined.
- [ ] Environment variables validated for target runtime.
- [ ] Health checks and logging confirmed in deployment target.
- [ ] Security checklist high-severity items closed.
- [ ] Performance baseline reviewed against target thresholds.

## Smoke Test Matrix

| Flow | Expected Result | Status |
| --- | --- | --- |
| Login/logout | Session lifecycle correct | TBD |
| Admin dashboard | Loads with authorized user only | TBD |
| Content mutation | Success/failure paths behave correctly | TBD |
| Public pages | Render and cache behavior correct | TBD |