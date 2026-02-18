# Accessibility Checklist

Last updated: 2026-02-18
Status: Active

## Goal

Enforce baseline accessibility across public and admin surfaces and prevent
regressions during Phase 4-6 refactors.

## Current Baseline Status

- [x] Dialog/sheet title semantics present in scanned `src/components` and
  `src/features` TSX files (no missing `DialogTitle`/`SheetTitle` hits).
- [x] Icon-only button patterns broadly include `aria-label` or `sr-only` text
  in navigation, table actions, and media controls.
- [x] Targeted regression checks now enforce form labeling and alert contracts in
  shared controls (`SearchInput`, `TagPicker`, `FieldError`) and newsletter
  email-input label wiring.
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

## Automated Coverage

Targeted CI-enforced accessibility contract tests are now active in:

- `src/components/tests/accessibility-contracts.test.ts`

Checks currently cover:

- dialog/sheet title semantics (`DialogContent`/`DialogTitle`,
  `SheetContent`/`SheetTitle`) across app usage.
- required ARIA/sr-only labels in shared navigation components.
- required labels/alerts for shared form-control patterns.

## Remaining Gaps

Contrast verification and reduced-motion standardization still require follow-up
work before full accessibility hardening is complete.
