# ADR 0006 — Brand System & Component Architecture

**Status:** Accepted
**Date:** 2026-02-17
**Decision Owners:** Nu Graphix (Marcus)
**Related ADRs:**

- 0001 Project Foundation

---

## Context

Nu Graphix Studio requires a consistent brand identity across the public marketing site, admin system, and future SaaS products. Brand data (company name, tagline, SEO defaults, social links, asset paths) must be centralized and accessible from any component without prop drilling or scattered constants.

---

## Decision

### 1. Brand Configuration as Single Source of Truth

All brand data lives in a single typed configuration object:

```
src/components/brand/
  brand.types.ts       # TypeScript interfaces
  brand.config.ts      # Configuration values (single source of truth)
  brand-meta.ts        # SEO/meta helper functions
  brand-provider.tsx   # React context provider
  use-brand.ts         # Consumer hook
  brand-logo.tsx       # Logo component
  brand-wordmark.tsx   # Wordmark component (with compact variant)
  brand-badge.tsx      # Brand badge component
  index.ts             # Barrel export
```

### 2. Type System

The `BrandConfig` interface captures:

| Property | Type | Purpose |
|----------|------|---------|
| `companyName` | `string` | Legal/display company name |
| `siteName` | `string` | Site display name |
| `productName` | `string` | Product identifier |
| `tagline` | `string` | Marketing tagline |
| `description` | `string` | Long-form company description |
| `siteUrl` | `string` | Canonical site URL |
| `contactEmail` | `string` | Public contact email |
| `serviceName` | `string` | Service offering label |
| `dashboardLabel` | `string` | Admin dashboard title |
| `dashboardSubLabel` | `string` | Admin dashboard subtitle |
| `social` | `BrandSocialLinks` | Social media URLs |
| `assets` | `BrandAssets` | Logo, icon, OG image paths |
| `seo` | `BrandSeoConfig` | Default title, template, description |
| `rss` | `BrandRssConfig` | RSS feed metadata |
| `email` | `BrandEmailConfig` | Default from address |

### 3. Context-Based Distribution

Brand data is distributed via React context:

```ts
// Provider (mount in root or layout)
<BrandProvider>
  <App />
</BrandProvider>

// Consumer (any component)
const brand = useBrand()
```

The provider defaults to the static `brandConfig` export, so it works both with and without an explicit provider — components can always import `brandConfig` directly for non-React contexts (server functions, meta helpers).

### 4. Brand Components

Three brand display components consume the context:

- **`BrandLogo`** — Renders the logo image from `assets.logoPath`. Accepts all `<img>` props except `src` and `alt` (derived from config). Default size: `size-14`.
- **`BrandWordmark`** — Renders the brand name as styled text. Supports `compact` prop to toggle between `companyName` and `siteName`.
- **`BrandBadge`** — Renders `siteName` in a shadcn `Badge` component with `variant="secondary"`.

All components use `cn()` for className merging and forward remaining props.

### 5. SEO Meta Helpers

Utility functions for `<head>` meta tags:

- `getBrandPageTitle(pageTitle?)` — Returns formatted title using `titleTemplate` or `defaultTitle`
- `getBrandMetaDescription(description?)` — Returns provided description or `defaultDescription`
- `getBrandSiteOrigin()` — Returns canonical URL without trailing slash

These are pure functions that import `brandConfig` directly (no context dependency) for use in route `head()` functions.

### 6. Brand Values (Current)

| Field | Value |
|-------|-------|
| Company name | Nu Graphix |
| Product name | Nu Graphix Studio |
| Tagline | Structured digital systems for operationally complex businesses. |
| Site URL | https://nugraphix.co.za |
| Contact | hello@nugraphix.co.za |
| Theme | Cyan/emerald accent, gray neutrals (via shadcn tokens) |

---

## Barrel Export

All public API is exported from `@/components/brand`:

```ts
// Components
export { BrandLogo, BrandWordmark, BrandBadge }

// Config & context
export { brandConfig, BrandProvider, useBrand }

// Meta helpers
export { getBrandPageTitle, getBrandMetaDescription, getBrandSiteOrigin }

// Types
export type { BrandConfig, BrandAssets, BrandSeoConfig, BrandSocialLinks, BrandRssConfig, BrandEmailConfig }
```

---

## Consequences

### Positive

- Single source of truth for all brand data
- Type-safe throughout the application
- Context-based for component trees, direct import for server/meta contexts
- Components are decoupled from brand values (swap config = rebrand)
- SEO helpers produce consistent page titles and descriptions
- Barrel export keeps imports clean

### Trade-offs

- `BrandProvider` must be mounted in the component tree for `useBrand()` to work (falls back to static config if not mounted)
- Brand assets (logo SVG, favicon, OG image) must exist in `public/` — `og-image.png` not yet created
- Social links for Facebook and Instagram are empty (to be populated when accounts are established)

---

## Future Considerations

- Mount `BrandProvider` in `__root.tsx` when layouts consume `useBrand()`
- Create `og-image.png` for social sharing
- Add dark/light logo variants if needed
- Add `BrandFooter` and `BrandNavbar` components as marketing site develops
- Consider extracting brand config to a shared package if multiple apps need it

---
