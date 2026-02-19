# `src/features/contact` and `src/features/email` Reference

Last updated: 2026-02-18

## Purpose

These two features provide lead intake plus outbound communication operations.
`contact` captures and manages inquiries. `email` handles delivery, preferences,
subscriptions, and provider webhooks.

## Contact Feature Contract

### Scope

1. Public contact submission flow.
2. Anti-abuse controls (honeypot/timing/recaptcha/rate limit).
3. Admin lead operations (queue, filters, assignment, status, notes).

### Key modules

- `src/features/contact/server/contact.ts`
- `src/features/contact/server/admin-contacts.ts`
- `src/features/contact/server/contact-repository.ts`
- `src/features/contact/server/recaptcha.server.ts`

### Routes

- Public: `src/routes/_public/contact/index.tsx`
- Admin: `src/routes/admin/contacts/index.tsx`

## Email Feature Contract

### Scope

1. Provider-abstracted outbound email delivery.
2. Message/event lifecycle persistence.
3. User preference and public subscription flows.
4. Provider webhook handling.
5. Admin delivery monitoring and retry operations.

### Key modules

- `src/features/email/server/send.server.ts`
- `src/features/email/server/workflows.server.ts`
- `src/features/email/server/repository.server.ts`
- `src/features/email/server/provider-registry.server.ts`
- `src/features/email/server/webhooks.server.ts`

### Routes

- Admin operations: `src/routes/admin/email/index.tsx`
- Account preferences: `src/routes/_auth/account/notifications.tsx`
- Public unsubscribe: `src/routes/_public/unsubscribe/index.tsx`
- Provider webhook: `src/routes/api/email/webhooks/resend.ts`

## Shared Contracts

- Inputs validated with Zod.
- Public write paths rate-limited.
- Sensitive errors mapped to safe `ServerResult` failures.
- Structured logs for mutation outcomes.
- Provider mode can run safely with noop adapter in local development.

## Integration Dependency

Contact workflows depend on email delivery contracts for operational follow-up
notifications. Any change to email workflow payloads must be reflected in
contact workflow integration tests.
