import { Link, useRouterState } from '@tanstack/react-router'
import { Loader2, LogOut } from 'lucide-react'
import type { AppSession } from '@/features/auth/model/session'
import { BrandWordmark } from '@/components/brand'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { getInitials } from '@/lib/utils'
import {
  adminNavigationGroups,
  isAdminPathActive,
} from '@/components/navigation/admin/navigation'

interface AdminSidebarProps {
  user: AppSession['user']
  isSigningOut?: boolean
  onSignOut?: () => Promise<void> | void
}

export function AdminSidebar({
  user,
  isSigningOut = false,
  onSignOut,
}: AdminSidebarProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const displayName = user.name.trim() || user.email
  const userInitials = getInitials(displayName, { fallback: 'NG' })

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="border-sidebar-border bg-sidebar/40 flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
          <BrandWordmark compact className="text-sidebar-foreground text-sm" />
          <span className="bg-sidebar-accent text-sidebar-accent-foreground rounded-full px-2 py-1 text-[11px] font-medium">
            Admin
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {adminNavigationGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const itemActive = isAdminPathActive(pathname, item.to)

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={itemActive}
                      tooltip={item.title}
                    >
                      <Link to={item.to}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>

                    {item.items?.length ? (
                      <SidebarMenuSub>
                        {item.items.map((child) => {
                          const childActive = isAdminPathActive(pathname, child.to)
                          return (
                            <SidebarMenuSubItem key={child.to}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={childActive}
                              >
                                <Link to={child.to}>
                                  <span>{child.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="border-sidebar-border bg-sidebar/40 flex items-center gap-3 rounded-lg border px-3 py-2">
          <Avatar size="sm">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="text-sidebar-foreground/70 truncate text-xs">
              {user.email}
            </p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                void onSignOut?.()
              }}
              disabled={!onSignOut || isSigningOut}
            >
              {isSigningOut ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
