# Application Hosting Options

Last updated: 2026-02-18
Status: Draft

## Goal

Select app hosting/runtime that aligns with DB placement and predictable operations.

## Criteria

- Region alignment with chosen DB.
- Docker deployment support.
- Cost and operational complexity.
- TLS, networking, and observability support.
- Rollback and release safety.

## Option Table

| Option | Region Coverage | Pros | Cons | Decision |
| --- | --- | --- | --- | --- |
| VM (Docker) | Flexible | Simple control plane | More manual ops | Active baseline |
| Option B | TBD |  |  | Pending |

## Decision Notes

- Prefer minimal ops complexity for current team size.
- Avoid architecture changes that force large refactors.