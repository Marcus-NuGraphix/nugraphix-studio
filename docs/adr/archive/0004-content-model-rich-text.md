# ADR-0004: Content Model & Rich Text Strategy

- Status: Accepted
- Date: 2026-02-17
- Decision Owners: Nu Graphix (Marcus)
- Related: Phase 2 Design System, Phase 4 Security

## Context

Nu Graphix Studio requires rich content for:

- Blog posts
- Case studies
- Knowledge base entries
- Architecture documentation

The system must:

- Avoid XSS risk
- Support search
- Support structured editing
- Be SaaS-ready

## Decision

### Editor
- ProseKit (ProseMirror-based)

### Storage Model
- `content_json` (ProseMirror JSON) as canonical source
- `content_text` (plain text extraction) for search
- No raw HTML stored

### Rendering Rules
- No `dangerouslySetInnerHTML` without sanitization
- CSP will restrict inline script execution
- Links validated to prevent `javascript:` protocol

### Search Strategy
- Postgres FTS using `content_text`
- Index maintained on update

## Alternatives Considered

1) Markdown storage
- Rejected: weaker structural guarantees.

2) HTML storage
- Rejected: higher XSS risk and sanitization complexity.

## Consequences

### Positive
- Structured content model
- Safer rendering
- Strong search integration
- Extensible for future content workflows

### Trade-offs / Risks
- Requires JSON extraction logic
- Slightly more complex editor integration

## Follow-ups

- Implement content extraction utility
- Add search index updates inside mutation logic
