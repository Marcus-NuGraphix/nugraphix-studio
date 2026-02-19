# Observability Feature

Provides runtime web-vitals ingestion and admin performance visibility.

## Scope

1. Capture browser web-vitals measurements (`LCP`, `INP`, `CLS`, `FCP`, `TTFB`).
2. Persist telemetry samples for dashboard analytics.
3. Generate system notifications for degraded metric states.
4. Provide admin-only overview queries for dashboard and component demos.

## Contracts

- Validation: `schemas/web-vitals.ts`
- Persistence: `server/repository.ts`
- Server functions: `server/observability.ts`
- UI instrumentation: `ui/web-vitals-reporter.tsx`

## Route Integration

- `src/routes/__root.tsx` mounts `WebVitalsReporter`.
- `src/routes/admin/dashboard/index.tsx` consumes admin overview data.
- `src/routes/admin/components/ui/index.tsx` consumes persisted notifications.
