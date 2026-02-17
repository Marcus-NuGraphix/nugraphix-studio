type SiteNavigationTo = '/' | '/contact'

export interface SiteNavigationLink {
  label: string
  to: SiteNavigationTo
  description?: string
}

export interface SiteNavigationItem {
  label: string
  to?: SiteNavigationTo
  dropdown?: Array<SiteNavigationLink>
  dropdownCta?: SiteNavigationLink
}

export const quickNavigationLinks: Array<SiteNavigationLink> = [
  { label: 'Home', to: '/' },
  { label: 'Contact', to: '/contact' },
]

export const headerNavigationItems: Array<SiteNavigationItem> = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Contact',
    to: '/contact',
  },
]
