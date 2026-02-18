# Contact Feature

This feature owns public inquiry capture and admin-side lead pipeline
operations.

## Scope

1. Public `/contact` page composition and submission flow.
2. Server-side anti-spam controls (honeypot, timing check, reCAPTCHA, rate
   limiting).
3. Persistence of validated submissions to `contact_submission`.
4. Admin `/admin/contacts` queue with filters, detail workflow, status updates,
   assignment, and notes.

## Module Map

- `client/contact.ts`: client-safe server function export for form submission.
- `hooks/use-contact-form.ts`: contact form state and submit handling.
- `model/lead-form.ts`: canonical lead option values and labels.
- `model/filters.ts`: admin filter/search contract.
- `model/types.ts`: contact domain contracts.
- `server/contact.ts`: public submission handler.
- `server/recaptcha.server.ts`: server-side token verification.
- `server/admin-contacts.ts`: admin server functions (list/detail/mutations/stats).
- `server/contact-repository.ts`: Drizzle repository for contact entities.
- `ui/contact-page.tsx`, `ui/contact-form.tsx`, `ui/contact-hero.tsx`: public UI.
- `ui/admin/*`: admin route components (filters, table, detail drawer, stats).
- `index.ts`: feature public API barrel.

## Route Integration

- Public route: `src/routes/_public/contact/index.tsx` -> `ContactPage`.
- Admin route: `src/routes/admin/contacts/index.tsx` ->
  admin contact management surface.

## Runtime Flow

1. Public form posts `contactSubmissionSchema` payload to `submitContactFormFn`.
2. Server validates anti-spam controls and verifies reCAPTCHA token.
3. Rate-limit key (`ip + email`) is enforced.
4. Email workflows are queued via `sendContactSubmissionEmails`.
5. Submission is persisted in DB for admin follow-up.
6. Admin route loads list + stats and executes status/assignment/note mutations.
