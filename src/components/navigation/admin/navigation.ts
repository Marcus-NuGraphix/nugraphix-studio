import {
  BookOpenCheck,
  BookOpenText,
  Component,
  FileStack,
  FileText,
  Images,
  Inbox,
  LayoutDashboard,
  Mail,
  Milestone,
  Navigation,
  PanelsTopLeft,
  PlusCircle,
  Settings,
  SquareLibrary,
  UserCircle2,
  UsersRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type AdminStaticRoutePath =
  | '/admin'
  | '/admin/workspaces'
  | '/admin/workspaces/operations'
  | '/admin/workspaces/operations/dashboard'
  | '/admin/workspaces/operations/users'
  | '/admin/workspaces/operations/contacts'
  | '/admin/workspaces/operations/email'
  | '/admin/workspaces/operations/account'
  | '/admin/workspaces/operations/settings'
  | '/admin/workspaces/content'
  | '/admin/workspaces/content/posts'
  | '/admin/workspaces/content/posts/new'
  | '/admin/workspaces/content/media'
  | '/admin/workspaces/content/kb'
  | '/admin/workspaces/platform'
  | '/admin/workspaces/platform/docs'
  | '/admin/workspaces/platform/docs/architecture'
  | '/admin/workspaces/platform/docs/adr'
  | '/admin/workspaces/platform/docs/phases'
  | '/admin/workspaces/platform/components'
  | '/admin/workspaces/platform/components/ui'
  | '/admin/workspaces/platform/components/navigation'
  | '/admin/workspaces/platform/components/marketing'
  | '/admin/dashboard'
  | '/admin/content'
  | '/admin/content/posts'
  | '/admin/content/posts/new'
  | '/admin/media'
  | '/admin/kb'
  | '/admin/users'
  | '/admin/account'
  | '/admin/settings'
  | '/admin/contacts'
  | '/admin/email'
  | '/admin/docs'
  | '/admin/docs/architecture'
  | '/admin/docs/adr'
  | '/admin/docs/phases'
  | '/admin/components'
  | '/admin/components/ui'
  | '/admin/components/navigation'
  | '/admin/components/marketing'

type AdminDynamicRoutePath =
  | `/admin/workspaces/operations/users/${string}`
  | `/admin/workspaces/content/posts/${string}`
  | `/admin/workspaces/content/media/${string}`
  | `/admin/workspaces/content/kb/${string}`
  | `/admin/content/posts/${string}`
  | `/admin/media/${string}`
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

export type AdminWorkspaceId = 'operations' | 'content' | 'platform'

type AdminWorkspaceRoutePath =
  | '/admin/workspaces/operations'
  | '/admin/workspaces/content'
  | '/admin/workspaces/platform'

export interface AdminWorkspaceLink {
  id: AdminWorkspaceId
  title: string
  to: AdminWorkspaceRoutePath
}

export const adminWorkspaceLinks: Array<AdminWorkspaceLink> = [
  { id: 'operations', title: 'Operations', to: '/admin/workspaces/operations' },
  { id: 'content', title: 'Content', to: '/admin/workspaces/content' },
  { id: 'platform', title: 'Platform', to: '/admin/workspaces/platform' },
]

export const adminNavigationGroups: Array<AdminNavGroup> = [
  {
    title: 'Workspace',
    items: [
      {
        title: 'Operations',
        to: '/admin/workspaces/operations',
        icon: PanelsTopLeft,
        description: 'Workspace landing and operations entry point',
      },
      {
        title: 'Dashboard',
        to: '/admin/workspaces/operations/dashboard',
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
        to: '/admin/workspaces/content',
        icon: SquareLibrary,
        description: 'Publishing and editorial workflows',
        items: [
          { title: 'Posts', to: '/admin/workspaces/content/posts' },
          { title: 'New Post', to: '/admin/workspaces/content/posts/new' },
          { title: 'Media', to: '/admin/workspaces/content/media' },
        ],
      },
      {
        title: 'Media Library',
        to: '/admin/workspaces/content/media',
        icon: Images,
        description: 'Asset uploads, previews, and metadata lifecycle',
      },
      {
        title: 'Knowledge Base',
        to: '/admin/workspaces/content/kb',
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
        to: '/admin/workspaces/platform/docs',
        icon: BookOpenCheck,
        description: 'Architecture, ADRs, and implementation phases',
        items: [
          {
            title: 'Architecture',
            to: '/admin/workspaces/platform/docs/architecture',
          },
          { title: 'ADRs', to: '/admin/workspaces/platform/docs/adr' },
          { title: 'Phases', to: '/admin/workspaces/platform/docs/phases' },
        ],
      },
    ],
  },
  {
    title: 'Components',
    items: [
      {
        title: 'Component Hub',
        to: '/admin/workspaces/platform/components',
        icon: Component,
        description: 'Inventory and composition guides',
        items: [
          { title: 'UI Primitives', to: '/admin/workspaces/platform/components/ui' },
          {
            title: 'Navigation',
            to: '/admin/workspaces/platform/components/navigation',
          },
          {
            title: 'Marketing',
            to: '/admin/workspaces/platform/components/marketing',
          },
        ],
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        title: 'Users',
        to: '/admin/workspaces/operations/users',
        icon: UsersRound,
        description: 'Accounts, roles, and security activity',
      },
      {
        title: 'Contacts',
        to: '/admin/workspaces/operations/contacts',
        icon: Inbox,
        description: 'Inbound lead queue and follow-up ownership',
      },
      {
        title: 'Email',
        to: '/admin/workspaces/operations/email',
        icon: Mail,
        description: 'Delivery monitoring, retries, and webhook trace',
      },
      {
        title: 'Account',
        to: '/admin/workspaces/operations/account',
        icon: UserCircle2,
        description: 'Your own admin profile and security controls',
      },
      {
        title: 'Settings',
        to: '/admin/workspaces/operations/settings',
        icon: Settings,
        description: 'Platform controls and preferences',
      },
    ],
  },
]

export const adminQuickAccessLinks: Array<AdminNavChild> = [
  { title: 'Content', to: '/admin/workspaces/content' },
  { title: 'Media', to: '/admin/workspaces/content/media' },
  { title: 'Contacts', to: '/admin/workspaces/operations/contacts' },
  { title: 'Email', to: '/admin/workspaces/operations/email' },
  { title: 'Docs', to: '/admin/workspaces/platform/docs' },
  { title: 'Components', to: '/admin/workspaces/platform/components' },
  { title: 'Users', to: '/admin/workspaces/operations/users' },
  { title: 'Account', to: '/admin/workspaces/operations/account' },
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

const workspaceLegacyPrefixes: Record<AdminWorkspaceId, Array<string>> = {
  operations: [
    '/admin/dashboard',
    '/admin/users',
    '/admin/contacts',
    '/admin/email',
    '/admin/account',
    '/admin/settings',
  ],
  content: ['/admin/content', '/admin/media', '/admin/kb'],
  platform: ['/admin/docs', '/admin/components'],
}

export const getAdminWorkspaceFromPath = (pathname: string): AdminWorkspaceId => {
  const normalized = normalizePath(pathname)

  const canonicalWorkspace = adminWorkspaceLinks.find(
    (workspace) =>
      normalized === workspace.to || normalized.startsWith(`${workspace.to}/`),
  )
  if (canonicalWorkspace) {
    return canonicalWorkspace.id
  }

  for (const [workspace, prefixes] of Object.entries(workspaceLegacyPrefixes) as Array<
    [AdminWorkspaceId, Array<string>]
  >) {
    if (
      prefixes.some(
        (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
      )
    ) {
      return workspace
    }
  }

  return 'operations'
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

adminBreadcrumbMap.set('/admin/workspaces/operations', [
  { label: 'Operations', to: '/admin/workspaces/operations' },
])
adminBreadcrumbMap.set('/admin/workspaces/content', [
  { label: 'Content', to: '/admin/workspaces/content' },
])
adminBreadcrumbMap.set('/admin/workspaces/platform', [
  { label: 'Platform', to: '/admin/workspaces/platform' },
])

export const getAdminBreadcrumbs = (pathname: string): Array<AdminBreadcrumb> => {
  const normalized = normalizePath(pathname)

  const exactMatch = adminBreadcrumbMap.get(normalized)
  if (exactMatch) {
    return exactMatch
  }

  if (
    (normalized.startsWith('/admin/workspaces/content/posts/') &&
      normalized !== '/admin/workspaces/content/posts/new') ||
    (normalized.startsWith('/admin/content/posts/') &&
      normalized !== '/admin/content/posts/new')
  ) {
    const postId = normalized.startsWith('/admin/workspaces/content/posts/')
      ? normalized.replace('/admin/workspaces/content/posts/', '')
      : normalized.replace('/admin/content/posts/', '')
    return [
      { label: 'Content Hub', to: '/admin/workspaces/content' },
      { label: 'Posts', to: '/admin/workspaces/content/posts' },
      { label: toIdentifierLabel(postId, 'Post') },
    ]
  }

  if (
    normalized.startsWith('/admin/workspaces/content/media/') ||
    normalized.startsWith('/admin/media/')
  ) {
    const assetId = normalized.startsWith('/admin/workspaces/content/media/')
      ? normalized.replace('/admin/workspaces/content/media/', '')
      : normalized.replace('/admin/media/', '')
    return [
      { label: 'Media Library', to: '/admin/workspaces/content/media' },
      { label: toIdentifierLabel(assetId, 'Asset') },
    ]
  }

  if (
    normalized.startsWith('/admin/workspaces/content/kb/') ||
    normalized.startsWith('/admin/kb/')
  ) {
    const slug = normalized.startsWith('/admin/workspaces/content/kb/')
      ? normalized.replace('/admin/workspaces/content/kb/', '')
      : normalized.replace('/admin/kb/', '')
    return [
      { label: 'Knowledge Base', to: '/admin/workspaces/content/kb' },
      { label: toLabelFromSlug(slug) || 'Entry' },
    ]
  }

  if (normalized.startsWith('/admin/users/')) {
    const userId = normalized.replace('/admin/users/', '')
    return [
      { label: 'Users', to: '/admin/workspaces/operations/users' },
      { label: toIdentifierLabel(userId, 'User') },
    ]
  }

  if (normalized.startsWith('/admin/workspaces/operations/users/')) {
    const userId = normalized.replace('/admin/workspaces/operations/users/', '')
    return [
      { label: 'Users', to: '/admin/workspaces/operations/users' },
      { label: toIdentifierLabel(userId, 'User') },
    ]
  }

  return [{ label: 'Dashboard', to: '/admin/workspaces/operations/dashboard' }]
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
    to: '/admin/workspaces/content',
  },
  {
    title: 'Media Library',
    description: 'Reusable asset management for posts and documentation.',
    icon: Images,
    to: '/admin/workspaces/content/media',
  },
  {
    title: 'Documentation',
    description: 'Architecture references, ADR decisions, and phase guidance.',
    icon: FileStack,
    to: '/admin/workspaces/platform/docs',
  },
  {
    title: 'Component Governance',
    description: 'UI primitives, navigation systems, and marketing layouts.',
    icon: Navigation,
    to: '/admin/workspaces/platform/components',
  },
  {
    title: 'Roadmap & Standards',
    description: 'Execution checkpoints and quality control by delivery phase.',
    icon: Milestone,
    to: '/admin/workspaces/platform/docs/phases',
  },
  {
    title: 'Platform Health',
    description: 'User roles, lead flow, and configuration controls.',
    icon: Settings,
    to: '/admin/workspaces/operations/settings',
  },
  {
    title: 'Contact Pipeline',
    description: 'Lead intake workflow, assignment, and conversion stages.',
    icon: Inbox,
    to: '/admin/workspaces/operations/contacts',
  },
  {
    title: 'Email Operations',
    description: 'Message lifecycle visibility with retry and event tracing.',
    icon: Mail,
    to: '/admin/workspaces/operations/email',
  },
  {
    title: 'Create New Post',
    description: 'Open a new editorial draft and move it through publishing.',
    icon: PlusCircle,
    to: '/admin/workspaces/content/posts/new',
  },
]
