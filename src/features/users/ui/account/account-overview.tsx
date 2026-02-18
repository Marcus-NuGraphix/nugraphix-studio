import { Link } from '@tanstack/react-router'
import { CheckCircle2, KeyRound, ShieldCheck, UsersRound } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/metrics/stat-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getInitials } from '@/lib/utils'
import { ChangePasswordForm } from '@/features/users/ui/account/change-password-form'
import { ProfileForm } from '@/features/users/ui/account/profile-form'
import { SecurityEventsList } from '@/features/users/ui/account/security-events-list'
import { SessionList } from '@/features/users/ui/account/session-list'

interface AccountOverviewProps {
  profile: {
    id: string
    name: string
    email: string
    image: string | null
    role: 'user' | 'admin'
    status: 'active' | 'suspended' | 'invited'
    emailVerified: boolean
    createdAt: Date
  }
  sessions: Array<{
    id: string
    token: string
    userAgent?: string | null
    ipAddress?: string | null
    expiresAt: Date
    createdAt: Date
  }>
  securityEvents: Array<{
    id: string
    type: string
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
  }>
  isAdminView?: boolean
  onUpdateProfile: (value: { name: string; image?: string }) => Promise<void>
  onChangePassword: (value: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
    revokeOtherSessions: boolean
  }) => Promise<void>
  onRevokeSession: (token: string) => Promise<void>
  onRevokeAllSessions: () => Promise<void>
}

export function AccountOverview({
  profile,
  sessions,
  securityEvents,
  isAdminView = false,
  onUpdateProfile,
  onChangePassword,
  onRevokeSession,
  onRevokeAllSessions,
}: AccountOverviewProps) {
  const initials = getInitials(profile.name || profile.email, { fallback: 'NG' })
  const accountAgeDays = Math.max(
    1,
    Math.ceil(
      (Date.now() - new Date(profile.createdAt).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  )

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow={isAdminView ? 'Admin Profile' : 'My Account'}
        title={isAdminView ? 'Admin Account Center' : 'Account Center'}
        description={
          isAdminView
            ? 'Manage your own admin profile and account security while staying aligned with platform governance.'
            : 'Manage your profile, password, and active sessions in one secure workspace.'
        }
        actions={
          isAdminView ? (
            <Link
              to="/admin/users/$userId"
              params={{ userId: profile.id }}
              className="bg-secondary text-foreground hover:bg-secondary/80 inline-flex h-9 items-center rounded-md px-3 text-sm font-medium"
            >
              Open Admin User Detail
            </Link>
          ) : undefined
        }
      />

      <Card className="border-border bg-card shadow-none">
        <CardContent className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src={profile.image ?? undefined} alt={profile.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-semibold text-foreground">
                {profile.name}
              </p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-border bg-muted text-foreground">
              Role: {profile.role}
            </Badge>
            <Badge className="border-border bg-muted text-foreground">
              Status: {profile.status}
            </Badge>
            <Badge
              className={
                profile.emailVerified
                  ? 'border-accent/30 bg-accent/10 text-foreground'
                  : 'border-destructive/30 bg-destructive/10 text-destructive'
              }
            >
              {profile.emailVerified ? 'Email Verified' : 'Email Unverified'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Sessions"
          value={sessions.length}
          description="Current authenticated browser/device sessions."
          icon={UsersRound}
          tone="info"
        />
        <StatCard
          label="Security Events"
          value={securityEvents.length}
          description="Recorded account security timeline entries."
          icon={ShieldCheck}
          tone="neutral"
        />
        <StatCard
          label="Account Age"
          value={`${accountAgeDays}d`}
          description="Days since this account was created."
          icon={CheckCircle2}
          tone="neutral"
        />
        <StatCard
          label="Credential Status"
          value="Protected"
          description="Password and session controls are available."
          icon={KeyRound}
          tone="success"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm
              defaultName={profile.name}
              defaultImage={profile.image}
              onSubmit={onUpdateProfile}
            />
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Password & Access</CardTitle>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm onSubmit={onChangePassword} />
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <SessionList
              sessions={sessions}
              onRevokeSession={onRevokeSession}
              onRevokeAll={onRevokeAllSessions}
            />
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>Security Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <SecurityEventsList events={securityEvents} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
