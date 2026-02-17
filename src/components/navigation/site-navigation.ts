type SiteNavigationTo =
  | '/'
  | '/about'
  | '/services'
  | '/portfolio'
  | '/blog'
  | '/contact'

export interface SiteNavigationLink {
  label: string
  to: SiteNavigationTo
  description?: string
}

export interface SiteNavigationItem extends SiteNavigationLink {}

export const quickNavigationLinks: Array<SiteNavigationLink> = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

export const headerNavigationItems: Array<SiteNavigationItem> = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]
