# Accessibility Checklist

Last updated: 2026-02-18
Status: Baseline Complete

## Goal

Enforce baseline accessibility across public and admin surfaces and prevent
regressions during Phase 4-6 refactors.

## Current Baseline Status

- [x] Dialog/sheet title semantics present in scanned `src/components` and
  `src/features` TSX files (no missing `DialogTitle`/`SheetTitle` hits).
- [x] Icon-only button patterns broadly include `aria-label` or `sr-only` text
  in navigation, table actions, and media controls.
- [~] Form labels and field-error wiring are mostly present but not yet covered
  by automated regression tests.
- [~] Focus-visible styles appear in core primitives, but no focused audit
  artifact exists yet.
- [ ] Color contrast audit against WCAG AA has not been recorded for key flows.
- [ ] Reduced-motion behavior has not been standardized across motion-heavy UI.

## Priority Scope

1. Shared primitives and shell navigation.
2. Auth/account/content-management forms.
3. Media gallery/lightbox and carousel surfaces.

## Required Checks Before Phase 4 Exit

- [ ] Validate keyboard-only navigation for:
  - site header and mobile nav sheet
  - admin sidebar/workspace navigation
  - dialog/sheet close and action controls
- [ ] Verify label + error association in auth, contact, user admin forms.
- [ ] Document contrast checks for token states (`primary`, `accent`,
  `destructive`, muted text).
- [ ] Add reduced-motion handling for animated components
  (`card-slider`, gallery/lightbox transitions).

## Automation Gap

No automated accessibility gate is currently enforced in CI. This is tracked as
Phase 4 tasking and Phase 6 security/accessibility hardening support.
