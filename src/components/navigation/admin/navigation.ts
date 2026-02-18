import {
  BookOpenCheck,
  BookOpenText,
  Component,
  FileStack,
  FileText,
  LayoutDashboard,
  Milestone,
  Navigation,
  PanelsTopLeft,
  PlusCircle,
  Settings,
  SquareLibrary,
  UsersRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type AdminStaticRoutePath =
  | '/admin'
  | '/admin/dashboard'
  | '/admin/content'
  | '/admin/content/posts'
  | '/admin/content/posts/new'
  | '/admin/kb'
  | '/admin/users'
  | '/admin/settings'
  | '/admin/docs'
  | '/admin/docs/architecture'
  | '/admin/docs/adr'
  | '/admin/docs/phases'
  | '/admin/components'
  | '/admin/components/ui'
  | '/admin/components/navigation'
  | '/admin/components/marketing'

type AdminDynamicRoutePath =
  | `/admin/content/posts/${string}`
  | `/admin/users/${string}`
  | `/admin/kb/${string}`

export type AdminRoutePath = AdminStaticRoutePath | AdminDynamicRoutePath

export interface AdminNavChild {
  title: string
  to: AdminStaticRoutePath
  description?: string
}

export interface AdminNavItem extends AdminNavChild {
  icon: LucideIcon
  items?: Array<AdminNavChild>
}

export interface AdminNavGroup {
  title: string
  items: Array<AdminNavItem>
}

export const adminNavigationGroups: Array<AdminNavGroup> = [
  {
    title: 'Workspace',
    items: [
      {
        title: 'Overview',
        to: '/admin',
        icon: PanelsTopLeft,
        description: 'Entry point and workspace summaries',
      },
      {
        title: 'Dashboard',
        to: '/admin/dashboard',
        icon: LayoutDashboard,
        description: 'Operations snapshots and quick actions',
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        title: 'Content Hub',
        to: '/admin/content',
        icon: SquareLibrary,
        description: 'Publishing and editorial workflows',
        items: [
          { title: 'Posts', to: '/admin/content/posts' },
          { title: 'New Post', to: '/admin/content/posts/new' },
        ],
      },
      {
        title: 'Knowledge Base',
        to: '/admin/kb',
        icon: BookOpenText,
        description: 'Internal documentation entries',
      },
    ],
  },
  {
    title: 'Documentation',
    items: [
      {
        title: 'Docs Hub',
        to: '/admin/docs',
        icon: BookOpenCheck,
        description: 'Architecture, ADRs, and implementation phases',
        items: [
          { title: 'Architecture', to: '/admin/docs/architecture' },
          { title: 'ADRs', to: '/admin/docs/adr' },
          { title: 'Phases', to: '/admin/docs/phases' },
        ],
      },
    ],
  },
  {
    title: 'Components',
    items: [
      {
        title: 'Component Hub',
        to: '/admin/components',
        icon: Component,
        description: 'Inventory and composition guides',
        items: [
          { title: 'UI Primitives', to: '/admin/components/ui' },
          { title: 'Navigation', to: '/admin/components/navigation' },
          { title: 'Marketing', to: '/admin/components/marketing' },
        ],
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        title: 'Users',
        to: '/admin/users',
        icon: UsersRound,
        description: 'Accounts, roles, and security activity',
      },
      {
        title: 'Settings',
        to: '/admin/settings',
        icon: Settings,
        description: 'Platform controls and preferences',
      },
    ],
  },
]

export const adminQuickAccessLinks: Array<AdminNavChild> = [
  { title: 'Content', to: '/admin/content' },
  { title: 'Docs', to: '/admin/docs' },
  { title: 'Components', to: '/admin/components' },
  { title: 'Users', to: '/admin/users' },
]

export interface AdminBreadcrumb {
  label: string
  to?: AdminStaticRoutePath
}

const normalizePath = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return '/admin'
  return trimmed.length > 1 ? trimmed.replace(/\/+$/, '') : trimmed
}

export const isAdminPathActive = (pathname: string, to: string) => {
  const current = normalizePath(pathname)
  const target = normalizePath(to)

  if (target === '/admin') {
    return current === '/admin'
  }

  return current === target || current.startsWith(`${target}/`)
}

const toLabelFromSlug = (value: string) =>
  value
    .split('-')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(' ')

const toIdentifierLabel = (value: string, fallback: string) => {
  const normalized = value.trim()
  if (!normalized) return fallback
  if (normalized.includes('-')) return toLabelFromSlug(normalized)
  return normalized.length > 18
    ? `${normalized.slice(0, 10)}...`
    : normalized.toUpperCase()
}

const adminBreadcrumbMap = new Map<string, Array<AdminBreadcrumb>>()

for (const group of adminNavigationGroups) {
  for (const item of group.items) {
    adminBreadcrumbMap.set(normalizePath(item.to), [{ label: item.title, to: item.to }])

    for (const child of item.items ?? []) {
      adminBreadcrumbMap.set(normalizePath(child.to), [
        { label: item.title, to: item.to },
        { label: child.title, to: child.to },
      ])
    }
  }
}

export const getAdminBreadcrumbs = (pathname: string): Array<AdminBreadcrumb> => {
  const normalized = normalizePath(pathname)

  const exactMatch = adminBreadcrumbMap.get(normalized)
  if (exactMatch) {
    return exactMatch
  }

  if (
    normalized.startsWith('/admin/content/posts/') &&
    normalized !== '/admin/content/posts/new'
  ) {
    const postId = normalized.replace('/admin/content/posts/', '')
    return [
      { label: 'Content Hub', to: '/admin/content' },
      { label: 'Posts', to: '/admin/content/posts' },
      { label: toIdentifierLabel(postId, 'Post') },
    ]
  }

  if (normalized.startsWith('/admin/kb/')) {
    const slug = normalized.replace('/admin/kb/', '')
    return [
      { label: 'Knowledge Base', to: '/admin/kb' },
      { label: toLabelFromSlug(slug) || 'Entry' },
    ]
  }

  if (normalized.startsWith('/admin/users/')) {
    const userId = normalized.replace('/admin/users/', '')
    return [
      { label: 'Users', to: '/admin/users' },
      { label: toIdentifierLabel(userId, 'User') },
    ]
  }

  return [{ label: 'Dashboard', to: '/admin/dashboard' }]
}

export const adminSectionCards: Array<{
  title: string
  description: string
  icon: LucideIcon
  to: AdminStaticRoutePath
}> = [
  {
    title: 'Content Operations',
    description: 'Editorial workflows, post lifecycle, and KB updates.',
    icon: FileText,
    to: '/admin/content',
  },
  {
    title: 'Documentation',
    description: 'Architecture references, ADR decisions, and phase guidance.',
    icon: FileStack,
    to: '/admin/docs',
  },
  {
    title: 'Component Governance',
    description: 'UI primitives, navigation systems, and marketing layouts.',
    icon: Navigation,
    to: '/admin/components',
  },
  {
    title: 'Roadmap & Standards',
    description: 'Execution checkpoints and quality control by delivery phase.',
    icon: Milestone,
    to: '/admin/docs/phases',
  },
  {
    title: 'Platform Health',
    description: 'User roles, account security, and configuration controls.',
    icon: Settings,
    to: '/admin/settings',
  },
  {
    title: 'Create New Post',
    description: 'Open a new editorial draft and move it through publishing.',
    icon: PlusCircle,
    to: '/admin/content/posts/new',
  },
]
