# Database Hosting Options (South Africa Latency Focus)

Last updated: 2026-02-18
Status: Draft

## Goal

Choose DB hosting with evidence-based latency and operational fit for South Africa users.

## Evaluation Criteria

- Network latency from South Africa (p50/p95).
- Region availability and failover options.
- Operational complexity and cost.
- Migration risk from current provider/region.
- Compatibility with Drizzle + current runtime model.

## Candidate Matrix

| Option | Region | Estimated Latency Risk | Operational Notes | Decision |
| --- | --- | --- | --- | --- |
| Current Neon region (Singapore) | ap-southeast-1 | High for ZA | Existing setup | Baseline |
| Candidate A | TBD | TBD | TBD | Pending |
| Candidate B | TBD | TBD | TBD | Pending |

## Required Evidence

- [ ] Synthetic ping/connection timings.
- [ ] Query benchmark samples.
- [ ] Route TTFB delta attributable to DB distance.