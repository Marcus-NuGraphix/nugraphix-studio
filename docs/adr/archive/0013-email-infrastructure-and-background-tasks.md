# ADR-0013: Email Infrastructure & Background Tasks

**Status:** Accepted
**Date:** 2026-02-17

## Context

The application needs to send transactional emails (welcome, password reset, notifications) and marketing emails (blog subscriptions, press releases). We need:

1. Provider flexibility — ability to switch between Resend, SendGrid, or a noop provider for local development.
2. Reliable delivery — retries for transient failures, audit trail.
3. Webhook processing — track delivery, open, click, bounce events.
4. Background processing — emails should not block request handlers.

## Decision

### Email Provider Registry

A pluggable provider system resolved from the `EMAIL_PROVIDER` environment variable:

- `noop` — logs to console, no actual sending (default for local dev)
- `resend` — Resend API via `resend` npm package
- `sendgrid` — SendGrid API

Providers implement a common interface. The registry (`provider-registry.server.ts`) resolves the active provider at startup.

### Email Pipeline

1. **Caller** invokes a workflow function (e.g., `sendWelcomeEmail`)
2. **Workflow** renders a React Email template to HTML, constructs the message payload
3. **Send module** enqueues via the background task system
4. **Background task handler** calls the resolved provider to deliver
5. **On failure** — the task is re-queued with exponential backoff (up to 5 attempts)

### Background Task System

A Postgres-backed job queue (`src/lib/server/background-tasks.ts`):

- **Table:** `app_background_task` (auto-created on first use)
- **Claiming:** `FOR UPDATE SKIP LOCKED` for safe concurrent processing
- **Retry:** Failed tasks re-queue with 30-second delay, up to 5 attempts
- **Drain:** Called opportunistically after enqueue, and via a scheduled endpoint (`BACKGROUND_TASKS_DRAIN_SECRET` / `CRON_SECRET`)

This avoids a Redis dependency for the MVP while providing durable, retryable task processing.

### Webhook Processing

Provider webhooks (Resend, SendGrid) are processed to update delivery status and log events in the `email_event` table. Events tracked: `delivered`, `opened`, `clicked`, `bounced`, `complained`.

### Email Preferences & Subscriptions

- **Preferences** — per-user topic opt-in/out (blog, press, product, security, account)
- **Subscriptions** — public email list with unsubscribe token support

### Database Tables

| Table | Purpose |
|-------|---------|
| `email_message` | Message log with status, provider, attempts, error tracking |
| `email_event` | Provider webhook events (delivery, open, click, bounce) |
| `email_preference` | Per-user topic preferences |
| `email_subscription` | Public mailing list with unsubscribe tokens |

## Consequences

- Local development uses `noop` provider — no external service dependency.
- Switching providers requires only changing `EMAIL_PROVIDER` env var and providing API keys.
- Background tasks are durable (Postgres) — tasks survive server restarts.
- Email templates are React components — type-safe, testable, familiar DX.
- The audit trail (message + event tables) enables admin email dashboard monitoring.
