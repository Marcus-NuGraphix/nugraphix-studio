# Email Feature

This feature owns transactional/editorial email delivery, subscription state,
template rendering, provider integration, webhook ingestion, and admin
operability.

## Scope and Responsibilities

1. Persist all outbound email records before send attempts.
2. Render typed email templates for auth, security, editorial, and contact
   workflows.
3. Dispatch through provider abstraction (`noop` or `resend`).
4. Process provider webhook events and update lifecycle status.
5. Provide account preference controls and public subscription/unsubscribe
   flows.
6. Provide admin visibility and retry operations.

## File Map

- `client/email.ts`: client-safe exports of feature server functions.
- `model/types.ts`: provider, status, topic, template, and preference
  contracts.
- `lib/query-keys.ts`: email query-key factory definitions.
- `schemas/*`: zod contracts for admin filters, preferences, subscriptions,
  contact, and webhooks.
- `server/provider.ts`: provider interface contract.
- `server/provider-registry.server.ts`: runtime provider selection by env.
- `server/noop-provider.server.ts`: safe no-op provider for local/dev.
- `server/resend-provider.server.ts`: Resend provider adapter.
- `server/templates.server.tsx`: React Email template rendering.
- `server/send.server.ts`: queue, dispatch, lifecycle updates, retry.
- `server/repository.server.ts`: persistence layer for messages/events/prefs.
- `server/webhooks.server.ts`: Resend webhook verification and event ingestion.
- `server/workflows.server.ts`: domain workflows (auth/security/editorial/contact).
- `server/email.ts`: route-facing server functions for account/public/admin.
- `ui/public/email-subscribe-card.tsx`: public topic subscription UI.
- `ui/account/email-preferences-form.tsx`: account preference controls.
- `ui/admin/email-overview-cards.tsx`: admin KPI cards.
- `ui/admin/email-messages-table.tsx`: admin message list with row selection,
  status treatment, and inspect/retry actions.
- `ui/admin/email-delivery-funnel.tsx`: funnel-first delivery summary and
  status-stage filtering surface.
- `ui/admin/email-detail-drawer.tsx`: side-panel event timeline detail for
  selected messages.

## Runtime Architecture

### Dispatch Pipeline

1. Caller invokes workflow or server function (`queueTemplatedEmail`).
2. Template is rendered (`buildEmailTemplate`).
3. `email_message` row is created with `status='queued'`.
4. Background task `email.send` is enqueued.
5. `processQueuedEmailTask` sends via selected provider.
6. Message status and `email_event` records are updated.

### Provider Selection

- `EMAIL_PROVIDER=noop` -> local-safe no-op provider.
- `EMAIL_PROVIDER=resend` -> Resend SDK provider.
- Selection occurs in `server/provider-registry.server.ts`.

### Webhook Flow

1. Route `/api/email/webhooks/resend` forwards raw payload + headers.
2. `processResendWebhook` verifies signature when
   `RESEND_WEBHOOK_SECRET` exists.
3. Event is normalized, persisted in `email_event`, and linked to
   `email_message` by `providerMessageId` when available.
4. Webhook route enforces payload-size limits and structured rejection responses
   for malformed/signature-failed payloads.

### Preference and Subscription Model

- User-level preferences: `email_preference`.
- Topic subscriptions: `email_subscription`.
- Editorial recipient resolution merges:
  - active user recipients (preference-aware)
  - active explicit subscriptions
- De-duplication is email-based in repository logic.

## Data Model Summary

### `email_message`

Stores outbound message envelope, payload metadata, attempts, provider IDs, and
delivery status transitions.

### `email_event`

Stores provider and internal lifecycle events (`email.sent`, `email.delivered`,
`email.failed`, etc.) with optional unique `providerEventId`.

### `email_preference`

Stores per-user toggles for transactional/editorial subtopics.

### `email_subscription`

Stores topic subscriptions and unsubscribe tokens for public and user-linked
recipients.

## Security and Reliability Controls (Current State)

1. Input validation on all route-facing server functions via zod.
2. Admin operations require `requireAdmin` plus permission checks.
3. Public subscribe flow is rate-limited via shared durable limiter by
   IP+email key.
4. Idempotency supported for queued messages using `idempotencyKey`.
5. Webhook signature verification is supported when secret is configured.
6. Outbound delivery attempts and failures are logged to DB event tables.
7. Admin bulk retry operations are supported for selected failed messages.

## Important Current Behaviors

1. Queue dispatch is persisted in `app_background_task` and processed via
   registered handlers with retries.
2. Due-task execution requires a scheduler trigger (for example cron calling
   `/api/internal/background-tasks/drain`) in production.
3. If `RESEND_WEBHOOK_SECRET` is unset, webhook payloads are accepted without
   signature verification in non-production only. Production `resend` mode now
   fails closed when the secret is missing.
4. Retry is currently limited to messages with status `failed`.
5. `/dashboard/email` now supports drawer detail inspection through
   `selectedMessageId` search state and timeline hydration from `email_event`.
6. Delivery overview now tracks engagement stages (`opened`, `clicked`) in
   addition to queue/delivery/failure stages.
7. Public unsubscribe route reports invalid/used token with generic UI fallback.

## Integration Points

- Account notifications:
  - `src/routes/account/notifications.tsx`
- Admin email operations:
  - `src/routes/dashboard/email/index.tsx`
- Public unsubscribe:
  - `src/routes/_public/unsubscribe.tsx`
- Resend webhook endpoint:
  - `src/routes/api/email/webhooks/resend.ts`
- Cross-domain workflow callers:
  - `src/features/auth/server/auth.ts`
  - `src/features/users/server/users.ts`
  - `src/features/contact/server/contact.ts`
  - `src/features/news/server/posts.ts`
  - `src/features/news/press/server/press-releases.ts`

## Testing Status

- Present:
  - `schemas/preferences.test.ts`
  - `schemas/subscriptions.test.ts`
- Missing/high-value additions:
  - provider adapter tests
  - send pipeline tests (queued -> sent/failed transitions)
  - broader webhook verification and mapping tests (route boundary tests now
    cover payload-size, malformed payload, and signature-failure contracts)
  - repository recipient merge/idempotency tests

## Hardening Roadmap

Improvement tracking for this domain is maintained in `docs/rebuild-plan/*` and `docs/operations/DEFERRED-RISK-BACKLOG.md`.

## Related Documentation

- `docs/domains/email.md`
- `docs/operations/EMAIL-DELIVERY.md`
- `docs/operations/EMAIL-LOCAL-DEV.md`
