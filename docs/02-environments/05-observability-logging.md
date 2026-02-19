# Observability and Logging

Last updated: 2026-02-18
Status: Draft

## Goal

Provide production-usable logs and health signals with minimal operational overhead.

## Logging Contract

- [ ] Use structured logs (`src/lib/observability/logger.ts`).
- [ ] Redact secrets and sensitive payloads.
- [ ] Include request correlation fields (request ID, route, user/role when safe).
- [ ] Log mutation outcomes and critical failures.

## Health and Diagnostics

- [ ] Health endpoint returns app and dependency status.
- [ ] Readiness endpoint includes DB connectivity check.
- [ ] Basic uptime/error-rate visibility documented.

## Alerting Baseline

- [ ] Auth failures spike.
- [ ] Elevated 5xx rate.
- [ ] Migration failure.
- [ ] Background task backlog growth.

## External References

- OWASP logging guidance: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html