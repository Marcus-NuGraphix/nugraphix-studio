# UI Component Inventory (`src/components/ui`)

Last audited: 2026-02-18

This inventory records the current primitive/component surface available in
`src/components/ui` before composition-layer integration into routes/features.

## Summary

- Total files: 57
- Purpose: token-driven, reusable primitives built on Radix/shadcn patterns
- Theme contract: must use design token classes (`bg-background`, `text-foreground`, etc.) per ADR-0014

## Layout And Structure Primitives

- `accordion.tsx`
- `aspect-ratio.tsx`
- `collapsible.tsx`
- `drawer.tsx`
- `resizable.tsx`
- `scroll-area.tsx`
- `separator.tsx`
- `sheet.tsx`
- `sidebar.tsx`
- `skeleton.tsx`

## Navigation And Overlay Primitives

- `breadcrumb.tsx`
- `context-menu.tsx`
- `dialog.tsx`
- `dropdown-menu.tsx`
- `hover-card.tsx`
- `menubar.tsx`
- `navigation-menu.tsx`
- `pagination.tsx`
- `popover.tsx`
- `tabs.tsx`
- `tooltip.tsx`

## Input And Form Primitives

- `button.tsx`
- `button-group.tsx`
- `calendar.tsx`
- `checkbox.tsx`
- `combobox.tsx`
- `command.tsx`
- `field.tsx`
- `input.tsx`
- `input-group.tsx`
- `input-otp.tsx`
- `label.tsx`
- `native-select.tsx`
- `radio-group.tsx`
- `select.tsx`
- `slider.tsx`
- `switch.tsx`
- `textarea.tsx`
- `toggle.tsx`
- `toggle-group.tsx`

## Data, Display, And Feedback Primitives

- `alert.tsx`
- `alert-dialog.tsx`
- `avatar.tsx`
- `badge.tsx`
- `card.tsx`
- `carousel.tsx`
- `chart.tsx`
- `empty.tsx`
- `item.tsx`
- `kbd.tsx`
- `progress.tsx`
- `spinner.tsx`
- `table.tsx`

## Runtime Utilities

- `direction.tsx`
- `sonner.tsx`

## Audit Notes

- The primitive set is broad enough to build the Phase 02 initial system-level
  components (`AppShell`, `SidebarNav`, `TopBar`, `PageHeader`, `StatCard`,
  `DataTable`, `FormField`, `EmptyState`, `ConfirmDialog`, `EditorShell`,
  `TagPicker`, `SearchInput`) without adding third-party UI libraries.
- Current repo-wide lint backlog still includes unrelated `src/components/ui/*`
  style-order/type-import issues and should be resolved in a dedicated cleanup pass.
