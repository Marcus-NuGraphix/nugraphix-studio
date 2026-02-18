/**
 * White-Label Rebranding Tool
 *
 * Rewrites brand references across the entire codebase to match a new
 * brand identity. Reads configuration from `tools/white-label.config.json`.
 *
 * Usage:
 *   pnpm white-label              # apply rebrand
 *   pnpm white-label --dry-run    # preview changes without writing
 *
 * What it does:
 *   1. Regenerates `src/components/brand/brand.config.ts` from config
 *   2. Updates `public/manifest.json` (PWA metadata)
 *   3. Updates `package.json` name field
 *   4. Updates `.env.example` email/domain references
 *   5. Replaces hardcoded brand strings in all source files
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, extname, resolve } from 'node:path'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WhiteLabelConfig {
  brand: {
    legalName: string
    companyName: string
    siteName: string
    productName: string
    tagline: string
    description: string
    siteUrl: string
    contactEmail: string
    serviceName: string
    dashboardLabel: string
    dashboardSubLabel: string
  }
  social: Record<string, string>
  assets: {
    logoPath: string
    iconPath: string
    ogImagePath: string
  }
  seo: {
    defaultTitle: string
    titleTemplate: string
    defaultDescription: string
  }
  rss: {
    title: string
    description: string
  }
  email: {
    fromAddressDefault: string
    noReplyAddress: string
    replyToAddress: string
    contactNotificationAddress: string
  }
  manifest: {
    shortName: string
    themeColor: string
    backgroundColor: string
  }
  packageName: string
}

// ---------------------------------------------------------------------------
// Current brand values (what gets replaced)
// ---------------------------------------------------------------------------

const CURRENT = {
  companyName: 'Nu Graphix',
  productName: 'Nu Graphix Studio',
  legalName: 'Nu Graphix (Pty) Ltd',
  domain: 'nugraphix.co.za',
  slug: 'nugraphix',
  packageName: 'nugraphix-studio',
  contactEmail: 'hello@nugraphix.co.za',
  noReplyEmail: 'no-reply@nugraphix.co.za',
  socialX: 'https://x.com/nugraphix',
  socialLinkedin: 'https://linkedin.com/company/nugraphix',
  socialGithub: 'https://github.com/Marcus-NuGraphix',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ROOT = resolve(import.meta.dirname, '..')

const isDryRun = process.argv.includes('--dry-run')

function loadConfig(): WhiteLabelConfig {
  const configPath = join(ROOT, 'tools', 'white-label.config.json')
  if (!existsSync(configPath)) {
    console.error(
      '\n  Missing config file: tools/white-label.config.json\n' +
      '  Copy tools/white-label.config.example.json and fill in your values.\n',
    )
    process.exit(1)
  }
  return JSON.parse(readFileSync(configPath, 'utf-8'))
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0]
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ---------------------------------------------------------------------------
// File walker
// ---------------------------------------------------------------------------

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', '.tanstack', '.agents', '.agent',
  '.claude', 'coverage', 'drizzle', '.next', '.output',
])

const SOURCE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.html',
  '.yml', '.yaml', '.toml', '.env', '.example',
])

function walkFiles(dir: string): string[] {
  const results: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      if (!SKIP_DIRS.has(entry)) {
        results.push(...walkFiles(full))
      }
    } else {
      const ext = extname(entry)
      // Include extensionless dotfiles like .env, .env.example
      if (SOURCE_EXTENSIONS.has(ext) || entry.startsWith('.env')) {
        results.push(full)
      }
    }
  }
  return results
}

// ---------------------------------------------------------------------------
// Replacers
// ---------------------------------------------------------------------------

interface Replacement {
  from: string | RegExp
  to: string
}

function buildReplacements(config: WhiteLabelConfig): Replacement[] {
  const newDomain = extractDomain(config.brand.siteUrl)
  const newSlug = slugify(config.brand.companyName)

  // Order matters: longer/more specific patterns first to avoid partial matches
  return [
    // Legal name (most specific)
    { from: CURRENT.legalName, to: config.brand.legalName },
    // Product name (before company name since it contains it)
    { from: CURRENT.productName, to: config.brand.productName },
    // Company name
    { from: CURRENT.companyName, to: config.brand.companyName },
    // Email addresses
    { from: CURRENT.contactEmail, to: config.brand.contactEmail },
    { from: CURRENT.noReplyEmail, to: config.email.noReplyAddress },
    // Domain (after emails to avoid double-replacing the domain inside emails)
    { from: CURRENT.domain, to: newDomain },
    // Social URLs
    { from: CURRENT.socialX, to: config.social.x ?? '' },
    { from: CURRENT.socialLinkedin, to: config.social.linkedin ?? '' },
    { from: CURRENT.socialGithub, to: config.social.github ?? '' },
    // Package name
    { from: CURRENT.packageName, to: config.packageName },
    // Slug (lowercase, used in URLs, test strings, etc.) — last to avoid clobbering
    { from: new RegExp(`\\b${CURRENT.slug}\\b`, 'g'), to: newSlug },
  ]
}

function applyReplacements(content: string, replacements: Replacement[]): string {
  let result = content
  for (const { from, to } of replacements) {
    if (!to) continue
    if (from instanceof RegExp) {
      result = result.replace(from, to)
    } else {
      // Global string replacement
      result = result.split(from).join(to)
    }
  }
  return result
}

// ---------------------------------------------------------------------------
// brand.config.ts generator
// ---------------------------------------------------------------------------

function generateBrandConfig(config: WhiteLabelConfig): string {
  const socialEntries = Object.entries(config.social)
    .filter(([, v]) => v)
    .map(([k, v]) => `    ${k}: '${v}',`)
    .join('\n')

  return `import type { BrandConfig } from '@/components/brand/brand.types'

export const brandConfig: BrandConfig = {
  legalName: '${config.brand.legalName}',
  companyName: '${config.brand.companyName}',
  siteName: '${config.brand.siteName}',
  productName: '${config.brand.productName}',

  tagline: '${config.brand.tagline}',

  description:
    '${config.brand.description}',

  siteUrl: '${config.brand.siteUrl}',
  contactEmail: '${config.brand.contactEmail}',

  serviceName: '${config.brand.serviceName}',
  dashboardLabel: '${config.brand.dashboardLabel}',
  dashboardSubLabel: '${config.brand.dashboardSubLabel}',

  social: {
${socialEntries}
  },

  assets: {
    logoPath: '${config.assets.logoPath}',
    iconPath: '${config.assets.iconPath}',
    ogImagePath: '${config.assets.ogImagePath}',
  },

  seo: {
    defaultTitle: '${config.seo.defaultTitle}',
    titleTemplate: '${config.seo.titleTemplate}',
    defaultDescription:
      '${config.seo.defaultDescription}',
  },

  rss: {
    title: '${config.rss.title}',
    description:
      '${config.rss.description}',
  },

  email: {
    fromAddressDefault: '${config.email.fromAddressDefault}',
  },
}
`
}

// ---------------------------------------------------------------------------
// manifest.json generator
// ---------------------------------------------------------------------------

function generateManifest(config: WhiteLabelConfig): string {
  const manifest = {
    short_name: config.manifest.shortName,
    name: config.brand.productName,
    icons: [
      { src: 'favicon.ico', sizes: '64x64 32x32 24x24 16x16', type: 'image/x-icon' },
      { src: 'logo192.png', type: 'image/png', sizes: '192x192' },
      { src: 'logo512.png', type: 'image/png', sizes: '512x512' },
    ],
    start_url: '.',
    display: 'standalone',
    theme_color: config.manifest.themeColor,
    background_color: config.manifest.backgroundColor,
  }
  return JSON.stringify(manifest, null, 2) + '\n'
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const config = loadConfig()
  const replacements = buildReplacements(config)

  console.log(isDryRun ? '\n  DRY RUN — no files will be written\n' : '\n  Applying white-label rebrand...\n')
  console.log(`  Company:  ${CURRENT.companyName} → ${config.brand.companyName}`)
  console.log(`  Product:  ${CURRENT.productName} → ${config.brand.productName}`)
  console.log(`  Domain:   ${CURRENT.domain} → ${extractDomain(config.brand.siteUrl)}`)
  console.log(`  Package:  ${CURRENT.packageName} → ${config.packageName}`)
  console.log()

  const changedFiles: string[] = []

  // 1. Generate brand.config.ts
  const brandConfigPath = join(ROOT, 'src', 'components', 'brand', 'brand.config.ts')
  const brandConfigContent = generateBrandConfig(config)
  if (!isDryRun) writeFileSync(brandConfigPath, brandConfigContent, 'utf-8')
  changedFiles.push('src/components/brand/brand.config.ts')
  console.log('  [brand]    src/components/brand/brand.config.ts')

  // 2. Generate manifest.json
  const manifestPath = join(ROOT, 'public', 'manifest.json')
  const manifestContent = generateManifest(config)
  if (!isDryRun) writeFileSync(manifestPath, manifestContent, 'utf-8')
  changedFiles.push('public/manifest.json')
  console.log('  [manifest] public/manifest.json')

  // 3. Walk source files and apply replacements
  const allFiles = walkFiles(ROOT)

  // Exclude the files we already generated and the tool itself
  const excludePaths = new Set([
    brandConfigPath,
    manifestPath,
    resolve(ROOT, 'tools', 'white-label.ts'),
    resolve(ROOT, 'tools', 'white-label.config.json'),
    resolve(ROOT, 'tools', 'white-label.config.example.json'),
  ])

  for (const filePath of allFiles) {
    if (excludePaths.has(filePath)) continue

    const original = readFileSync(filePath, 'utf-8')
    const updated = applyReplacements(original, replacements)

    if (updated !== original) {
      const relative = filePath.replace(ROOT + '/', '').replace(ROOT + '\\', '')
      if (!isDryRun) writeFileSync(filePath, updated, 'utf-8')
      changedFiles.push(relative)
      console.log(`  [replace]  ${relative}`)
    }
  }

  console.log()
  console.log(`  ${isDryRun ? 'Would update' : 'Updated'} ${changedFiles.length} file(s).`)

  if (isDryRun) {
    console.log('\n  Run without --dry-run to apply changes.\n')
  } else {
    console.log('\n  Rebrand complete. Review changes with `git diff` before committing.\n')
  }
}

main()
