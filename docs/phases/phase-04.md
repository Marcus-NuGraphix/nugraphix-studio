# Phase 04 - Security and Quality

Status: Active
Last updated: 2026-02-18

## Objective

Maintain production-grade security and quality posture while Blog MVP is built.

## Mandatory Controls

- [ ] Zod validation on all mutations.
- [ ] Server-side role checks on admin operations.
- [ ] No unsafe rich-text rendering.
- [ ] No secret/token leakage in logs or errors.
- [ ] Rate limiting coverage for public write endpoints.

## Blog-Specific Security Checks

- [ ] Slug conflict handling maps to deterministic failure codes.
- [ ] Publish/unpublish actions require admin authorization.
- [ ] Public post routes cannot access drafts.
- [ ] Content rendering pipeline blocks raw HTML injection.

## Quality Gates

- [ ] TypeScript strict checks pass.
- [ ] ESLint passes without new regressions.
- [ ] Build completes successfully.
- [ ] Critical behavior has test coverage or explicit test-plan notes.

## Exit Criteria

Blog MVP changes pass all security and quality controls without exceptions.
