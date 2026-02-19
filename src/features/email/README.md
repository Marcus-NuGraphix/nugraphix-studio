# Email Feature

This feature owns outbound email delivery, provider integration, webhook
ingestion, account preferences, and admin delivery operations.

## Scope

1. Queue and dispatch transactional/editorial email through provider adapters.
2. Persist message and event lifecycle history.
3. Manage per-user preferences and public topic subscriptions.
4. Handle unsubscribe-token flows.
5. Process Resend webhook callbacks with signature verification support.
6. Provide admin delivery monitoring and retry operations.

## Module Map

- `client/email.ts`: client-safe exports of route-facing server functions.
- `model/types.ts`: provider/topic/status/template contracts.
- `schemas/*`: zod validation for admin, preferences, subscriptions, webhooks.
- `server/provider*.ts`: provider abstraction and runtime registry.
- `server/templates.server.tsx`: React Email template rendering.
- `server/send.server.ts`: queue orchestration and delivery lifecycle writes.
- `server/repository.server.ts`: message/event/preferences/subscription queries.
- `server/workflows.server.ts`: auth/security/editorial/contact workflow helpers.
- `server/webhooks.server.ts`: Resend webhook verification + mapping.
- `server/email.ts`: route-facing server functions (account/public/admin).
- `ui/account/email-preferences-form.tsx`: account preferences form.
- `ui/public/email-subscribe-card.tsx`: public topic subscription form.
- `ui/admin/*`: admin email filters, overview, funnel, table, detail drawer.
- `index.ts`: feature public API barrel.

## Route Integration

- Admin operations: `src/routes/admin/email/index.tsx`.
- Account preferences: `src/routes/_auth/account/notifications.tsx`.
- Public unsubscribe landing: `src/routes/_public/unsubscribe/index.tsx`.
- Provider webhook endpoint: `src/routes/api/email/webhooks/resend.ts`.
- Public blog subscriptions: `src/routes/_public/blog/index.tsx`
  (`EmailSubscribeCard` usage).

## Delivery Pipeline

1. Workflow or route-facing server function calls queue helpers.
2. Template payload is rendered and message row is inserted (`email_message`).
3. Background task (`email.send`) dispatches via active provider.
4. Delivery updates and lifecycle events are written (`email_event`).
5. Admin UI consumes overview/list/detail server functions for operations.

## Security and Reliability Controls

1. All route-facing inputs are zod-validated.
2. Admin operations require admin session and permission assertions.
3. Public subscription flow is rate-limited by IP + email key.
4. Webhook body size is capped and malformed/signature-failed payloads are
   rejected with safe responses.
5. Local development can use `EMAIL_PROVIDER=noop` without external dependency.
