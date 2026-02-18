# Blog Feature

Owns editorial blog lifecycle for Nu Graphix Studio.

## Scope

1. Admin post listing and editor workflows.
2. Post create/update/publish/unpublish server operations.
3. Public blog listing and slug detail delivery.
4. Rich text authoring with ProseKit.

## Contracts

- Validation: Zod schemas in `schemas/posts.ts`.
- Persistence: Drizzle repository in `server/repository.ts`.
- Server functions: `server/posts.ts` (query + mutation contracts).
- Rich text: ProseKit JSON stored in `post.content` and derived text metadata.
- Incident posture: publish-state failures emit `incident.event` logs with
  escalation tracking (`blog.publish-flow`, `S2`).

## Route Integration

- `src/routes/admin/content/posts/index.tsx`
- `src/routes/admin/content/posts/new.tsx`
- `src/routes/admin/content/posts/$id.tsx`
- `src/routes/_public/blog/index.tsx`
- `src/routes/_public/blog/$slug.tsx`
