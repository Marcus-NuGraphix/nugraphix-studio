import { describe, expect, it } from 'vitest'
import {
  adminNavigationGroups,
  adminQuickAccessLinks,
  adminSectionCards,
  getAdminBreadcrumbs,
  getAdminWorkspaceFromPath,
} from '@/components/navigation/admin/navigation'

const collectNavigationTargets = () => {
  const groupTargets = adminNavigationGroups.flatMap((group) =>
    group.items.flatMap((item) => [item.to, ...(item.items?.map((child) => child.to) ?? [])]),
  )

  const quickAccessTargets = adminQuickAccessLinks.map((item) => item.to)
  const sectionCardTargets = adminSectionCards.map((item) => item.to)

  return [...groupTargets, ...quickAccessTargets, ...sectionCardTargets]
}

describe('admin navigation contracts', () => {
  it('uses canonical workspace paths for active navigation surfaces', () => {
    const targets = collectNavigationTargets()
    expect(targets.length).toBeGreaterThan(0)
    expect(targets.every((target) => target.startsWith('/admin/workspaces/'))).toBe(
      true,
    )
  })

  it('maps canonical and legacy paths to the expected workspace context', () => {
    expect(getAdminWorkspaceFromPath('/admin/workspaces/operations/users')).toBe(
      'operations',
    )
    expect(getAdminWorkspaceFromPath('/admin/users/user_123')).toBe('operations')

    expect(getAdminWorkspaceFromPath('/admin/workspaces/content/media')).toBe(
      'content',
    )
    expect(getAdminWorkspaceFromPath('/admin/content/posts')).toBe('content')

    expect(getAdminWorkspaceFromPath('/admin/workspaces/platform/docs')).toBe(
      'platform',
    )
    expect(getAdminWorkspaceFromPath('/admin/docs/architecture')).toBe('platform')
  })

  it('keeps breadcrumb parents canonical for legacy and canonical deep links', () => {
    const legacyMedia = getAdminBreadcrumbs('/admin/media/asset_123')
    const canonicalMedia = getAdminBreadcrumbs(
      '/admin/workspaces/content/media/asset_123',
    )
    expect(legacyMedia[0]).toEqual({
      label: 'Media Library',
      to: '/admin/workspaces/content/media',
    })
    expect(canonicalMedia[0]).toEqual({
      label: 'Media Library',
      to: '/admin/workspaces/content/media',
    })

    const legacyUser = getAdminBreadcrumbs('/admin/users/user_123')
    const canonicalUser = getAdminBreadcrumbs(
      '/admin/workspaces/operations/users/user_123',
    )
    expect(legacyUser[0]).toEqual({
      label: 'Users',
      to: '/admin/workspaces/operations/users',
    })
    expect(canonicalUser[0]).toEqual({
      label: 'Users',
      to: '/admin/workspaces/operations/users',
    })
  })
})
