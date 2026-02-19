# ADR-0023: Blog Editor Workflow with ProseKit

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0004, ADR-0010, ADR-0012, ADR-0014, ADR-0017, ADR-0020

## Context

Phase 03 required a production-ready blog authoring and publishing workflow.
The repository had route scaffolds for blog admin/public surfaces, but lacked:

1. A dedicated feature module for blog lifecycle contracts.
2. An implemented rich-text editor workflow for authoring.
3. End-to-end route integration with publish-state enforcement.

We needed an editor stack that integrates cleanly with TanStack route patterns,
retains typed JSON content, and avoids unsafe HTML rendering.

## Decision

Adopt a feature-first blog implementation with ProseKit-backed authoring.

1. **Feature module**
   - Create `src/features/blog` with `model`, `schemas`, `server`, and `ui`.
   - Centralize lifecycle behavior in server modules and repository contracts.

2. **Editor architecture**
   - Use `prosekit` as the rich-text editor runtime.
   - Build editor UI around `createEditor`, `defineBasicExtension`, and
     controlled JSON sync (`getDocJSON` / `setContent`).
   - Persist ProseKit doc JSON as serialized string in `post.content`.

3. **Route integration**
   - Implement `/admin/content/posts`, `/admin/content/posts/new`,
     `/admin/content/posts/$id` using feature server contracts.
   - Implement public `/blog` and `/blog/$slug` with published-only filtering
     and `notFound` handling for missing/unpublished posts.

4. **Safety and operations**
   - Render public content through safe text extraction utilities, not raw HTML.
   - Add structured mutation logs for create/update/publish/unpublish actions.
   - Keep validation and server failure handling aligned with `ServerResult<T>`
     and canonical server function patterns.

## Consequences

### Positive

1. Blog lifecycle logic is now centralized and reusable across routes.
2. Admin authoring supports rich text with explicit publish controls.
3. Public blog routes enforce publish state and avoid unsafe rendering paths.
4. Blog MVP passed lint/typecheck/test/build verification gates.

### Trade-offs

1. Storing ProseKit JSON in text requires parse/stringify utilities and careful
   schema evolution for future editor extensions.
2. MVP rendering currently prioritizes safety and consistency over advanced
   rich-node rendering fidelity.
3. Editor bundle cost increases due to the ProseKit runtime dependency.

## References

- ProseKit docs: `https://prosekit.dev/getting-started/introduction/`
- Feature entrypoint: `src/features/blog/index.ts`
- Editor component: `src/features/blog/ui/admin/prosekit-editor.tsx`
