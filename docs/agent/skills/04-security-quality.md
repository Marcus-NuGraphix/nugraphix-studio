# Skill 04 — Security & Quality

## Required checks for every mutation

- Zod validation present
- Server-side role enforcement (Better Auth helpers)
- Rate limiting for public write endpoints
- Turnstile verified server-side for public forms
- No sensitive error leaks
- Logs: structured, no secrets, no content_json

## Rich text (ProseKit) rules

- Store: content_json + content_text
- Render: no unsafe HTML injection
- Validate links to prevent javascript: protocols

## Verification commands

Before PR:

- `pnpm lint`
- `pnpm typecheck` (add if missing)
- `pnpm test` (if applicable)
- `pnpm build`
