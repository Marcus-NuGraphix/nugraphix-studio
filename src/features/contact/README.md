# Contact Feature

This feature owns the public contact page UX, lead-intake form, and secure
server submission workflow, plus dashboard CRM management for contact leads.

## Scope

1. Public contact page composition aligned with marketing design language.
2. Lead-intake form state, qualification fields, and submission logic.
3. Server-side contact submission handler with validation, anti-spam checks,
   reCAPTCHA verification, and rate limiting.
4. Persistence of accepted contact submissions into the CRM table.
5. Admin-side lead inbox, detail workflow, notes, and assignment controls.
6. Contact page copy rendering from content payload contracts.

## File Map

1. `client/contact.ts`: client-safe export of contact submission server
   function.
2. `server/contact.ts`: contact submission server handler.
3. `server/admin-contacts.ts`: admin-only contact CRM server functions.
4. `server/contact-repository.ts`: Drizzle data access for contact CRM.
5. `model/filters.ts`: admin list/search/filter contract.
6. `model/types.ts`: contact CRM domain and stats contracts.
7. `lib/query-keys.ts`: TanStack Query key factory for contacts.
8. `hooks/use-contact-form.ts`: reusable lead form state + submit behavior.
9. `model/lead-form.ts`: canonical lead option values/labels used by UI and
   schema validation.
10. `lib/recaptcha.client.ts`: client-side reCAPTCHA token execution utility.
11. `ui/contact-page.tsx`: public contact page composer.
12. `ui/contact-form.tsx`: conversion-focused lead form surface.
13. `ui/contact-hero.tsx`: contact hero section.
14. `ui/contact-methods.tsx`: retained marketing contact-channels section
    component (currently not rendered in route composition).
15. `server/recaptcha.server.ts`: server-side reCAPTCHA verification.
16. `ui/admin/*`: dashboard CRM UI primitives:

- `contacts-table.tsx`
- `contact-detail-card.tsx`
- `contact-status-badge.tsx`
- `contact-filters.tsx`
- `contact-notes.tsx`
- `contact-stats-bar.tsx`
- `contact-pipeline.tsx`

17. `index.ts`: feature API barrel.
18. Contact hero/layout styling is composed from marketing brand primitives
    (`HeroSection`, `BrandSectionShell`, `BrandSectionIntro`) backed by
    `src/components/patterns/*`.

## Workflow

1. UI submits via `submitContactFormFn`.
2. Server validates with `contactSubmissionSchema`.
3. Anti-spam checks enforce honeypot and minimum-fill timing.
4. reCAPTCHA token is verified server-side (`action`, `score`, hostname).
5. Request rate limiting is enforced by `ip + email`.
6. Successful requests trigger `sendContactSubmissionEmails`.
7. After email workflow succeeds, the submission is stored in
   `contact_submission` for dashboard CRM visibility.

Admin workflow:

1. `/dashboard/contacts` loads contact list + stats with validated filters.
2. Leads are reviewed via pipeline/status filters and assignee visibility.
3. `/dashboard/contacts/$contactId` supports status updates, assignment, and
   timestamped internal notes.

## Content Contract

1. Route loader (`src/routes/_public/contact/index.tsx`) resolves page content
   via `features/content`.
2. Contact UI components accept typed content payloads for hero, methods, and
   FAQ copy.
3. Lead qualification fields and anti-spam behavior are owned in this feature
   and do not depend on page copy source.
