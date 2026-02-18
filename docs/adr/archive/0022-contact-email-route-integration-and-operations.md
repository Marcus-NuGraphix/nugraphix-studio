# ADR-0022: Contact and Email Route Integration

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0012, ADR-0013, ADR-0020, ADR-0021

## Context

`src/features/contact` and `src/features/email` had substantial domain logic
implemented, but route integration was incomplete:

1. Contact admin operations had server functions but no production admin route.
2. Email admin operations, account preferences, unsubscribe UX, and webhook
   endpoint were not wired into route surfaces.
3. Admin navigation and breadcrumbs did not expose contact/email operations.
4. Feature READMEs referenced stale route structures and non-existent files.

This left lead operations and email observability below production readiness.

## Decision

Adopt full route-level integration for both domains.

1. **Contact operations route**
   - Add `/admin/contacts`.
   - Integrate list/search/paging, stats, detail drawer, status changes,
     assignment, and note capture using existing contact server functions.
   - Replace placeholder admin contact UI with shared-component admin primitives.

2. **Email operations routes**
   - Add `/admin/email` for delivery overview, funnel filtering, list/detail
     inspection, and retry operations.
   - Add `/account/notifications` for authenticated user preference management.
   - Add `/unsubscribe` public token flow.
   - Add `/api/email/webhooks/resend` for provider callbacks with payload-size
     guardrails and safe rejection responses.

3. **Navigation and route ergonomics**
   - Add contact/email entries to admin navigation, quick links, and workspace
     cards.
   - Extend `_auth` layout behavior so nested account routes (`/account/*`)
     retain account-oriented layout treatment.

4. **Link correctness and docs hygiene**
   - Align email workflow links to implemented routes (`/blog/$slug`,
     `/account/notifications`, `/unsubscribe`).
   - Rewrite contact/email feature READMEs to match current module and route
     topology.

## Consequences

### Positive

1. Contact and email features are now end-to-end operable from routed surfaces.
2. Admin operations now have consistent UI composition and clearer navigation.
3. Public/account email flows are available without ad hoc route workarounds.
4. Webhook ingestion is explicitly routable and hardened for production traffic.

### Trade-offs

1. Admin route footprint increases and requires ongoing maintenance.
2. Router-generated artifacts (for example `src/routeTree.gen.ts`) must stay
   in sync whenever route files are added or moved.
