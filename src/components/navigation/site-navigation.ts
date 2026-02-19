type SiteNavigationTo =
  | '/'
  | '/about'
  | '/services'
  | '/portfolio'
  | '/blog'
  | '/privacy-policy'
  | '/login'
  | '/signup'
  | '/contact'

export interface SiteNavigationLink {
  label: string
  to: SiteNavigationTo
  description?: string
  matchNested?: boolean
}

export interface SiteNavigationItem extends SiteNavigationLink {}

export const headerNavigationItems: Array<SiteNavigationItem> = [
  { label: 'Home', to: '/', description: 'Nu Graphix homepage' },
  {
    label: 'About',
    to: '/about',
    description: 'Company mission, positioning, and team operating model',
  },
  {
    label: 'Services',
    to: '/services',
    description: 'Delivery scopes and consulting capabilities',
  },
  {
    label: 'Portfolio',
    to: '/portfolio',
    description: 'Selected implementation examples and case outcomes',
    matchNested: true,
  },
  {
    label: 'Blog',
    to: '/blog',
    description: 'Engineering notes and operational systems insights',
    matchNested: true,
  },
  {
    label: 'Contact',
    to: '/contact',
    description: 'Discovery and project intake',
  },
]

export const quickNavigationLinks: Array<SiteNavigationLink> = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
]

const normalizePath = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return '/'
  return trimmed.length > 1 ? trimmed.replace(/\/+$/, '') : trimmed
}

export const isSitePathActive = (
  pathname: string,
  item: SiteNavigationLink,
) => {
  const current = normalizePath(pathname)
  const target = normalizePath(item.to)

  if (target === '/') {
    return current === '/'
  }

  if (item.matchNested) {
    return current === target || current.startsWith(`${target}/`)
  }

  return current === target
}
