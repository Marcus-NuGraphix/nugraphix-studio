# ADR-0030: Production Readiness Docs-First Hardening Program

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0010, ADR-0012, ADR-0014, ADR-0015, ADR-0018, ADR-0019, ADR-0024, ADR-0028

## Context

Blog MVP scope is completed, but repo-level production-readiness work now needs a
separate, structured execution surface. Existing planning docs were optimized
for MVP delivery and did not provide a dedicated, track-based system of record
for environment hardening, latency decisions, design-system governance,
dashboard workspace separation, and security hardening.

Without a dedicated execution structure, planning and implementation drift risk
increases and stale references become likely.

## Decision

Adopt a dedicated docs-first production hardening program under numbered tracks
in `docs/`:

1. `docs/00-index.md` as program entry point.
2. `docs/01-*` through `docs/08-*` as track-based execution documents.
3. `docs/plans/ROADMAP-2026-PRODUCTION-HARDENING.md` as active roadmap.
4. `docs/08-implementation/01-phased-plan.md` as active phase board.
5. Existing Blog MVP phase/roadmap docs remain historical records.

Program rules:

- Keep phases small, verifiable, and reversible.
- Preserve existing architectural contracts and module boundaries.
- Update docs and ADR metadata in the same work item as behavior changes.
- Treat stale plan pointers as defects and correct them immediately.

## Consequences

### Positive

1. Planning and execution now map one-to-one across audit, environment,
   hosting, design system, dashboard, security, and quality tracks.
2. Delivery can proceed procedurally with explicit phase gates and exit criteria.
3. Documentation drift risk is reduced through centralized entry points.

### Trade-offs

1. Additional documentation maintenance overhead is required each phase.
2. Teams must keep both historical MVP docs and active hardening docs coherent.

## References

- `docs/00-index.md`
- `docs/plans/ROADMAP-2026-PRODUCTION-HARDENING.md`
- `docs/08-implementation/01-phased-plan.md`
- `docs/08-implementation/03-decisions-log.md`