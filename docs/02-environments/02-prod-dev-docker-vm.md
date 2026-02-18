# Production-Dev Docker VM Runbook

Last updated: 2026-02-18
Status: Draft

## Goal

Run the app in a production-like container setup deployable to a VM with Docker.

## Runtime Contract

- [ ] Single reproducible image build.
- [ ] Explicit runtime env injection.
- [ ] Health endpoint for liveness and readiness.
- [ ] Structured logs to stdout/stderr.
- [ ] Migration strategy defined before serving traffic.

## Deployment Flow

1. Build image from locked commit.
2. Inject runtime env (no secrets in image).
3. Run migrations safely (job/manual gate).
4. Start app container.
5. Execute smoke checks.

## Verification

- [ ] `docker run`/compose start works with production env file.
- [ ] Auth flow works in containerized runtime.
- [ ] Static assets and SSR responses load correctly.
- [ ] Logs and health checks are available.

## Rollback Plan

- [ ] Previous image tag available.
- [ ] DB rollback policy documented for migration failures.