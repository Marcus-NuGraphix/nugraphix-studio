import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRight, Loader2, LogOut } from 'lucide-react'
import { BrandLockup } from '@/components/brand'
import {
  adminNavigationGroups,
  isAdminPathActive,
} from '@/components/navigation/admin/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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
import { cn, getInitials } from '@/lib/utils'

export interface AdminSidebarUser {
  email: string
  name: string
}

interface AdminSidebarProps {
  user: AdminSidebarUser
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
        <div className="border-sidebar-border bg-sidebar/40 flex items-center justify-between rounded-lg border px-3 py-2">
          <BrandLockup compact className="max-w-[200px]" />
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
                const hasChildren = Boolean(item.items?.length)

                if (!hasChildren) {
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
                    </SidebarMenuItem>
                  )
                }

                return (
                  <Collapsible
                    key={item.to}
                    defaultOpen={itemActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={itemActive}
                          tooltip={item.title}
                          className="group/collapsible-trigger"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((child) => {
                            const childActive = isAdminPathActive(pathname, child.to)
                            return (
                              <SidebarMenuSubItem key={child.to}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={childActive}
                                  size="md"
                                >
                                  <Link to={child.to}>
                                    <span>{child.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
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
            <p className="text-sidebar-foreground/70 truncate text-xs">{user.email}</p>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                void onSignOut?.()
              }}
              disabled={!onSignOut || isSigningOut}
              className={cn(isSigningOut && 'opacity-90')}
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
