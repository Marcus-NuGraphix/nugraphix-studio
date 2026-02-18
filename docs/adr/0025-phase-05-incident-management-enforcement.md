# ADR-0025: Phase-05 Incident Management Enforcement

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0010, ADR-0012, ADR-0017, ADR-0023, ADR-0024

## Context

Phase 05 required moving incident handling from informal process guidance to
enforceable, implementation-level controls.

The codebase already emitted structured `mutation.result` logs, but lacked:

1. A typed incident event contract with explicit severity (`S1/S2/S3`).
2. A deterministic 3-failure escalation guard.
3. Explicit publish-flow incident instrumentation for blog lifecycle failures.
4. A single reference runbook for rollback and diagnosis order.

## Decision

Adopt shared incident primitives in `src/lib/observability` and enforce them on
blog publish-state mutation paths.

1. **Incident event contract**
   - Add `logIncidentEvent(...)` in `src/lib/observability/incident-log.ts`.
   - Enforce typed fields: `incidentKey`, `domain`, `category`, `action`,
     `severity`, `status`, and optional operational context.

2. **3-failure escalation rule**
   - Add `recordFailureForEscalation(...)` and `resolveFailureEscalation(...)`
     in `src/lib/observability/failure-escalation.ts`.
   - Use process-local failure counters keyed by `incidentKey`.
   - Trigger `incident.event` escalation status when failures hit threshold
     (`3` by default).

3. **Publish-flow enforcement**
   - Instrument `publishBlogPostFn` and `unpublishBlogPostFn` in
     `src/features/blog/server/posts.ts` with:
     - explicit failure recording (`recordFailureForEscalation`)
     - explicit recovery resolution (`resolveFailureEscalation`)
   - Standardize blog publish-state incident identity:
     - `incidentKey`: `blog.publish-flow`
     - `category`: `publish-flow`
     - `severity`: `S2`

4. **Prevention and runbook documentation**
   - Add contract tests for incident instrumentation and escalation behavior.
   - Add rollback/diagnosis reference in
     `docs/reference/incident-debug-protocol.md`.

## Consequences

### Positive

1. Phase-05 rules are now observable and testable, not only procedural.
2. Repeated publish-flow failures now trigger deterministic escalation events.
3. Recovery transitions are explicitly logged, reducing ambiguous incident state.
4. Incident response order (logs first, one fix at a time, rollback path) has a
   concrete implementation reference.

### Trade-offs

1. Escalation counters are process-local and reset on process restart.
2. Additional logging and tests add small maintenance and CI overhead.

## References

- Incident runbook: `docs/reference/incident-debug-protocol.md`
- Phase doc: `docs/phases/phase-05.md`
- Blog server lifecycle: `src/features/blog/server/posts.ts`
- Observability primitives:
  - `src/lib/observability/incident-log.ts`
  - `src/lib/observability/failure-escalation.ts`

