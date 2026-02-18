# ADR-0028: Observability Telemetry and Admin Performance Integration

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0005, ADR-0010, ADR-0012, ADR-0018, ADR-0027

## Context

Newly integrated example-derived components (performance dashboard, notification
center, and marketing feed surfaces) required production data flow instead of
demo-only values.

Before this decision:

1. Performance and notification UI could render without persisted telemetry.
2. Core Web Vitals were not captured into a first-class domain model.
3. Admin dashboards did not have a unified server contract for metric summaries
   and alert lifecycle operations.
4. Shared `src/lib` server context utilities were not fully reusable across
   auth and observability workflows.

This created a gap between visual integration and operational correctness.

## Decision

Adopt a repo-native observability telemetry architecture spanning `src/lib`,
`src/lib/db/schema`, and `src/features/observability`.

1. **Introduce observability schema domain**
   - Add `web_vital_metric_sample` for telemetry ingestion.
   - Add `system_notification` for persisted operational alerts.
   - Add shared enums for metric, rating, and notification type contracts.

2. **Add observability feature module**
   - Create server functions for:
     - browser metric capture,
     - admin overview aggregation,
     - notification dismissal.
   - Keep all mutation inputs validated by Zod.
   - Enforce admin authorization for admin-facing queries/mutations.

3. **Instrument browser telemetry**
   - Mount a global `WebVitalsReporter` in root route shell.
   - Capture `LCP`, `INP`, `CLS`, `FCP`, and `TTFB` via `web-vitals`.
   - Persist samples through server functions, not direct client DB paths.

4. **Operationalize admin component surfaces**
   - Drive `/admin/dashboard` from persisted metric summaries.
   - Drive `/admin/components/ui` notification feed from persisted alerts.
   - Keep marketing feed route aligned to published content flow.

5. **Security and resilience controls**
   - Apply scoped rate limiting for telemetry capture endpoints.
   - Store normalized request context metadata (IP/user-agent) via shared
     server helpers.
   - Deduplicate repeated degraded-metric notifications in a time window.

## Consequences

### Positive

1. Example-derived components now operate on legitimate persisted data.
2. Observability becomes a first-class bounded context in the DB contract.
3. Admin users gain actionable performance and alert workflows.
4. Shared `src/lib` request-context and observability utilities reduce
   duplicated server logic.

### Trade-offs

1. Additional write volume from browser metric capture requires retention
   strategy planning.
2. Notification volume can grow without future policy tuning and archival.
3. Migration management is stricter due legacy drift; SQL artifacts must remain
   deterministic and idempotent.

## References

- Feature module: `src/features/observability/README.md`
- Schema domain: `src/lib/db/schema/observability/index.ts`
- Shared runtime helpers: `src/lib/server/request-context.ts`
- Root instrumentation: `src/routes/__root.tsx`
- Admin integrations:
  - `src/routes/admin/dashboard/index.tsx`
  - `src/routes/admin/components/ui/index.tsx`
- Migration artifacts:
  - `drizzle/0001_observability_telemetry.sql`
  - `drizzle/meta/_journal.json`
