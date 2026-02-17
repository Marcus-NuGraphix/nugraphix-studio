import { Link } from '@tanstack/react-router'
import { ArrowUpRight, MailCheck, ShieldCheck, User2 } from 'lucide-react'
import type { UserAuditItem } from '@/features/users/model/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { UserStatusBadge } from '@/features/users/ui/admin/user-status-badge'

interface UserDetailDrawerData {
  user: {
    id: string
    name: string
    email: string
    role: 'user' | 'admin'
    status: 'active' | 'suspended' | 'invited'
    emailVerified: boolean
    createdAt: Date
  }
  sessions: Array<{
    id: string
    userAgent: string | null
    ipAddress: string | null
    expiresAt: Date
    createdAt: Date
  }>
  auditEvents: Array<UserAuditItem>
}

interface UserDetailDrawerProps {
  open: boolean
  detail: UserDetailDrawerData | null
  isLoading: boolean
  currentUserId: string
  onOpenChange: (open: boolean) => void
  onToggleRole: () => void
  onToggleStatus: () => void
  onRevokeSessions: () => void
  onDelete: () => void
}

export function UserDetailDrawer({
  open,
  detail,
  isLoading,
  currentUserId,
  onOpenChange,
  onToggleRole,
  onToggleStatus,
  onRevokeSessions,
  onDelete,
}: UserDetailDrawerProps) {
  const user = detail?.user ?? null
  const isSelf = user ? user.id === currentUserId : false
  const sessionCount = detail?.sessions.length ?? 0
  const auditCount = detail?.auditEvents.length ?? 0
  const recentSessions = detail?.sessions.slice(0, 4) ?? []
  const recentAudit = detail?.auditEvents.slice(0, 4) ?? []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-xl overflow-y-auto bg-background p-0 text-foreground sm:max-w-xl">
        <SheetHeader className="space-y-2 border-b border-border px-5 py-4">
          <SheetTitle className="text-foreground">
            {user?.name ?? 'User Detail'}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Review account status, role permissions, session footprint, and
            recent audit activity.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-5 py-4">
          {isLoading ? (
            <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Loading user details...
            </div>
          ) : !user ? (
            <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Select a user from the directory, sessions, or audit tabs.
            </div>
          ) : (
            <>
              <section className="space-y-3 rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Joined {user.createdAt.toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <UserStatusBadge status={user.status} />

                    <Badge className="border border-border bg-muted text-foreground">
                      {user.role === 'admin' ? (
                        <ShieldCheck className="size-3.5" />
                      ) : (
                        <User2 className="size-3.5" />
                      )}
                      {user.role}
                    </Badge>

                    <Badge
                      className={
                        user.emailVerified
                          ? 'border border-border bg-muted text-foreground'
                          : 'border border-border bg-background text-muted-foreground'
                      }
                    >
                      {user.emailVerified ? (
                        <>
                          <MailCheck className="size-3.5" />
                          Verified
                        </>
                      ) : (
                        'Unverified'
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="bg-background text-foreground hover:bg-muted"
                    onClick={onToggleRole}
                    disabled={isSelf}
                  >
                    Set role to {user.role === 'admin' ? 'user' : 'admin'}
                  </Button>

                  <Button
                    variant="outline"
                    className="bg-background text-foreground hover:bg-muted"
                    onClick={onToggleStatus}
                    disabled={isSelf}
                  >
                    {user.status === 'suspended'
                      ? 'Reactivate User'
                      : 'Suspend User'}
                  </Button>

                  <Button
                    variant="outline"
                    className="bg-background text-foreground hover:bg-muted"
                    onClick={onRevokeSessions}
                  >
                    Revoke All Sessions
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={onDelete}
                    disabled={isSelf}
                  >
                    Delete User
                  </Button>
                </div>
              </section>

              <section className="space-y-2 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    Recent Sessions
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {sessionCount} total
                  </span>
                </div>

                {recentSessions.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No active sessions.
                  </p>
                ) : (
                  recentSessions.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-lg border border-border bg-muted/30 p-2 text-xs text-muted-foreground"
                    >
                      <p className="text-foreground/90">
                        {entry.userAgent ?? 'Unknown device'}
                      </p>
                      <p>IP: {entry.ipAddress ?? 'Unknown'}</p>
                      <p>Expires: {entry.expiresAt.toLocaleString()}</p>
                    </div>
                  ))
                )}
              </section>

              <section className="space-y-2 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    Recent Audit Events
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {auditCount} total
                  </span>
                </div>

                {recentAudit.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No audit events.
                  </p>
                ) : (
                  recentAudit.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-lg border border-border bg-muted/30 p-2 text-xs text-muted-foreground"
                    >
                      <p className="font-medium text-foreground">
                        {event.action}
                      </p>
                      <p>Actor: {event.actorEmail ?? 'system'}</p>
                      <p>{event.createdAt.toLocaleString()}</p>
                    </div>
                  ))
                )}
              </section>

              <div className="flex justify-end">
                <Button variant="outline" asChild className="hover:bg-muted">
                  <Link to="/admin/users/$userId" params={{ userId: user.id }}>
                    Open Full Profile
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
