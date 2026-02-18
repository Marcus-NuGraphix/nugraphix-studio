# Routing Surface Map

Last updated: 2026-02-18

## Route Groups

### Root shell

- `src/routes/__root.tsx`

### Public routes (`/_public` pathless layout)

- `src/routes/_public/route.tsx`
- `src/routes/_public/index.tsx`
- `src/routes/_public/about/index.tsx`
- `src/routes/_public/services/index.tsx`
- `src/routes/_public/portfolio/index.tsx`
- `src/routes/_public/portfolio/$slug.tsx`
- `src/routes/_public/blog/index.tsx`
- `src/routes/_public/blog/$slug.tsx`
- `src/routes/_public/contact/index.tsx`
- `src/routes/_public/unsubscribe/index.tsx`

### Auth/account routes (`/_auth` pathless layout)

- `src/routes/_auth/route.tsx`
- `src/routes/_auth/login/index.tsx`
- `src/routes/_auth/signup/index.tsx`
- `src/routes/_auth/forgot-password/index.tsx`
- `src/routes/_auth/reset-password/index.tsx`
- `src/routes/_auth/account/index.tsx`
- `src/routes/_auth/account/notifications.tsx`

### Legal routes (`/_legal` pathless layout)

- `src/routes/_legal/route.tsx`
- `src/routes/_legal/privacy-policy/index.tsx`

### Admin routes (`/admin` guarded layout)

- `src/routes/admin/route.tsx`
- `src/routes/admin/index.tsx`
- `src/routes/admin/dashboard/index.tsx`
- `src/routes/admin/account/index.tsx`
- `src/routes/admin/users/index.tsx`
- `src/routes/admin/users/$userId.tsx`
- `src/routes/admin/contacts/index.tsx`
- `src/routes/admin/email/index.tsx`
- `src/routes/admin/content/index.tsx`
- `src/routes/admin/content/posts/index.tsx`
- `src/routes/admin/content/posts/new.tsx`
- `src/routes/admin/content/posts/$id.tsx`
- `src/routes/admin/media/index.tsx`
- `src/routes/admin/media/$assetId.tsx`
- `src/routes/admin/kb/index.tsx`
- `src/routes/admin/kb/$slug.tsx`
- `src/routes/admin/components/index.tsx`
- `src/routes/admin/components/ui/index.tsx`
- `src/routes/admin/components/navigation/index.tsx`
- `src/routes/admin/components/marketing/index.tsx`
- `src/routes/admin/docs/index.tsx`
- `src/routes/admin/docs/architecture/index.tsx`
- `src/routes/admin/docs/adr/index.tsx`
- `src/routes/admin/docs/phases/index.tsx`
- `src/routes/admin/settings/index.tsx`

### API routes

- `src/routes/api/auth/$.ts`
- `src/routes/api/email/webhooks/resend.ts`

## Integration Notes

- Public and auth groups are pathless and do not alter URL prefixes.
- Admin group must remain server-guarded via layout-level auth checks.
- Editorial/media operations span both admin and public groups and must retain
  route-level contract validation.
