# PHASE 2 — DESIGN SYSTEM & UI/UX

## Nu Graphix Studio Design & Interface Architecture

---

# 3️⃣ Design System Specification

## Design Philosophy

Nu Graphix Studio must communicate:

* Structured thinking
* Operational clarity
* Technical maturity
* Systems discipline

Design principles:

* **Professional, modern, systems-first**
* **Clarity > decoration**
* **Consistency > creativity**
* **Hierarchy > color**
* **Whitespace is a tool**
* **Marketing feels premium**
* **Admin feels efficient**
* One shared component system

---

# Visual Identity Strategy

Marketing communicates:

> Authority, structure, long-term thinking.

Admin communicates:

> Speed, clarity, density, control.

They share:

* Typography
* Tokens
* Spacing rules
* Component architecture

They differ only in:

* Density
* Emphasis
* Layout rhythm

---

# Color System

You will use Tailwind palettes with role-based tokens.

---

## Brand Accent Colors

### Primary — Cyan

Purpose:

* CTA buttons
* Links
* Active states
* Focus rings

Recommended:

* Light: `cyan-600`
* Dark: `cyan-400`

---

### Secondary — Emerald

Purpose:

* Success states
* Published status
* Confirmations
* “System OK” indicators

Recommended:

* Light: `emerald-600`
* Dark: `emerald-400`

---

## Neutral Foundation

Use **Slate scale** exclusively.

Reason:

* Crisp
* Technical
* Professional
* Less “playful” than Zinc

Neutrals should make up 85–90% of UI surface.

---

## Semantic Colors

* Success → Emerald
* Info → Cyan
* Warning → Amber
* Destructive → Red

Never combine Cyan and Emerald aggressively in same component.

---

# Token Architecture (Design-Level Contract)

Even if implemented via Tailwind utility classes initially, think in tokens:

* `background`
* `foreground`
* `card`
* `muted`
* `border`
* `input`
* `ring`
* `primary`
* `secondary`
* `accent`
* `destructive`

All components must reference these roles conceptually.

This prevents visual entropy.

---

# Typography System

## Font Stack

* UI: Inter
* Mono: JetBrains Mono (code + KB snippets)

---

## Type Scale

Marketing:

* Hero: `text-4xl`
* Section headers: `text-3xl`
* Subheaders: `text-xl`
* Body: `text-base`
* Metadata: `text-sm`

Admin:

* Page title: `text-2xl`
* Section headers: `text-xl`
* Table content: `text-sm`
* Labels: `text-sm`

---

## Line Length Rules

Marketing prose:

* Max width ~70–80 characters
* Use container constraints

Admin:

* Keep descriptions short
* Use tooltips for extended guidance

---

# Spacing System

Approved scale only:

`0,1,2,3,4,6,8,10,12,16,20`

---

## Layout Rhythm

Marketing:

* Section vertical spacing: `py-12`
* Hero spacing: `py-20`
* Card padding: `p-6` or `p-8`

Admin:

* Section spacing: `py-6`
* Card padding: `p-4` or `p-6`
* Dense lists default to compact spacing

---

# Border Radius Rules

* Inputs: `rounded-md`
* Buttons: `rounded-md`
* Cards: `rounded-xl`
* Modals: `rounded-2xl`
* Badges: `rounded-full`

Never mix three radii inside one component.

---

# Shadow Philosophy

Shadows indicate elevation only.

* Cards: `shadow-sm`
* Dropdowns/popovers: `shadow-md`
* Modals: `shadow-lg`

No decorative shadow stacking.

---

# Motion Rules

Motion must be subtle and fast.

Duration: 150–250ms
Easing: ease-out

Animate:

* Hover states
* Dropdowns
* Accordions
* Modals

Avoid:

* Page-wide transitions
* Parallax
* Decorative animations

Performance > flourish.

---

# Dark Mode Strategy

Dark mode must be supported from day one.

Rules:

* Default to system preference
* Both marketing + admin support dark mode
* Ensure contrast compliance
* Test blog content readability in both modes
* Charts/tables must remain legible

Tokens must drive color — not manual overrides.

---

# Content Editing UX (ProseKit Integration)

Editor: ProseKit

Content Model:

* Stored as `content_json` (ProseMirror)
* Derived `content_text` for search
* No raw HTML storage

Editor requirements:

* Heading levels
* Bold / italic
* Code block
* Lists
* Blockquote
* Links
* Image embedding (future)

Admin Editor Layout:

* Title field
* Slug field
* Status selector (draft/published)
* Editor area
* Preview toggle
* Save + Publish controls

Rendering Rules:

* No `dangerouslySetInnerHTML` without sanitization
* CSP enabled in production
* Validate content server-side before save

---

# Accessibility Standards

Mandatory:

* Keyboard navigation everywhere
* Focus-visible ring present
* ARIA labels for icon buttons
* Error messages announced for forms
* Proper heading hierarchy
* No color-only status indicators
* Table row actions accessible via keyboard

Accessibility is not optional.

---

# Component Standards

Every component must follow this spec format.

---

## Component Spec Template

Component Name:
Purpose:
Where Used: marketing/admin/both

Props:

* Required:
* Optional:

Variants:

* size: sm/md/lg
* style: primary/secondary/ghost/destructive
* density: compact/comfortable

States:

* default
* hover
* active
* focus-visible
* loading
* disabled
* error
* empty

Accessibility:

* Keyboard supported
* ARIA compliant
* Error messaging accessible

---

# Global Component Rules

All forms must include:

* Label
* Helper text (optional)
* Error message (if invalid)
* Required indicator

All buttons must include:

* Loading state
* Disabled state
* Proper focus ring

All tables must include:

* Empty state component
* Consistent action menu
* Sticky header for long lists

---

# 4️⃣ UI Architecture Planning

---

# Layout System

## 1. Marketing Layout

Purpose:

* Conversion
* Authority
* Narrative clarity

Includes:

* Top navigation
* CTA blocks
* Structured footer
* Hero + section rhythm

No admin elements.

---

## 2. Auth Layout

Purpose:

* Clean login experience
* Minimal distraction

Includes:

* Centered card
* Minimal branding
* No nav

---

## 3. Admin Layout

Purpose:

* Speed
* Density
* Clarity

Includes:

* Sidebar navigation
* Top bar (search + quick actions)
* Content area (max-width constraint)
* Optional right panel

Admin must feel tool-like, not decorative.

---

# Route Planning (Aligned to Phase 1)

---

## Marketing Routes

| Route              | Purpose           | Data             |
| ------------------ | ----------------- | ---------------- |
| `/`                | Positioning       | featured content |
| `/about`           | Authority         | static           |
| `/services`        | Offer clarity     | static           |
| `/portfolio`       | Proof             | case studies     |
| `/portfolio/:slug` | Case study detail | case study       |
| `/blog`            | Authority         | posts            |
| `/blog/:slug`      | Post detail       | post             |
| `/contact`         | Lead capture      | form             |

---

## Admin Routes

| Route                      | Purpose           |
| -------------------------- | ----------------- |
| `/login`                   | Admin login       |
| `/admin`                   | Dashboard         |
| `/admin/content`           | CMS hub           |
| `/admin/content/posts`     | Post list         |
| `/admin/content/posts/new` | Create post       |
| `/admin/content/posts/:id` | Edit post         |
| `/admin/kb`                | Knowledge base    |
| `/admin/kb/:slug`          | KB editor         |
| `/admin/docs`              | Architecture docs |
| `/admin/settings`          | System config     |

---

# Shared Component Inventory (Initial)

System-level components:

* AppShell
* SidebarNav
* TopBar
* PageHeader
* Card
* StatCard
* DataTable
* FormField
* EmptyState
* ConfirmDialog
* Toast system
* EditorShell
* TagPicker
* SearchInput

These form your core UI system.

---

# Observability Considerations in UI

* All mutation failures must display structured error
* Toasts must map from ServerResult error codes
* Loading states must be consistent
* Long-running actions must provide feedback
* No silent failures

---

# Performance Considerations

* Marketing pages SSR-first
* Avoid heavy client bundles
* Lazy-load editor in admin
* No analytics blocking render
* Avoid heavy animation libraries

---

# Phase 2 Completion Criteria

Phase 2 is complete when:

* All design tokens defined
* All layouts structured
* Editor UX defined
* Route architecture locked
* Accessibility standards written
* Component spec template standardized

No code yet — just structure and rules.

---
