import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Shield, ShieldCheck, Users2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/metrics/stat-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAdminSessionFn } from '@/features/auth/server/session'
import { userAdminFiltersSchema } from '@/features/users/model/filters'
import {
  createUserFn,
  deleteUserFn,
  getAdminAuditEventsFn,
  getAdminUserSessionsFn,
  getUserDetailFn,
  getUsersFn,
  reactivateUserFn,
  revokeUserSessionsFn,
  setUserRoleFn,
  suspendUserFn,
} from '@/features/users/server/users'
import { UserAuditTab } from '@/features/users/ui/admin/user-audit-tab'
import { UserCreateDialog } from '@/features/users/ui/admin/user-create-dialog'
import { UserDetailDrawer } from '@/features/users/ui/admin/user-detail-drawer'
import { UserFilters } from '@/features/users/ui/admin/user-filters'
import { UserSessionsTab } from '@/features/users/ui/admin/user-sessions-tab'
import { UserSuspendDialog } from '@/features/users/ui/admin/user-suspend-dialog'
import { UsersTable } from '@/features/users/ui/admin/users-table'

const usersSearchSchema = userAdminFiltersSchema.partial()

export const Route = createFileRoute('/admin/users/')({
  validateSearch: (search) => usersSearchSchema.parse(search),
  loaderDeps: ({ search }) => userAdminFiltersSchema.parse(search),
  loader: async ({ deps }) => {
    const [adminSession, usersResult, sessions, audit] = await Promise.all([
      getAdminSessionFn(),
      getUsersFn({ data: deps }),
      getAdminUserSessionsFn({ data: { limit: 200 } }),
      getAdminAuditEventsFn({ data: { limit: 200 } }),
    ])

    return {
      users: usersResult.users,
      total: usersResult.total,
      page: usersResult.page,
      pageSize: usersResult.pageSize,
      totalPages: usersResult.totalPages,
      filters: usersResult.filters,
      sessions,
      audit,
      currentUserId: adminSession.user.id,
    }
  },
  component: UsersPage,
})

function UsersPage() {
  const router = useRouter()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const data = Route.useLoaderData()

  const [activeTab, setActiveTab] = useState<'directory' | 'sessions' | 'audit'>(
    'directory',
  )
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUserDetail, setSelectedUserDetail] =
    useState<Awaited<ReturnType<typeof getUserDetailFn>> | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [suspendUserId, setSuspendUserId] = useState<string | null>(null)

  const suspendTarget = useMemo(() => {
    if (!suspendUserId) return null
    const fromList = data.users.find((entry) => entry.id === suspendUserId)
    if (fromList) return fromList
    if (selectedUserDetail?.user.id === suspendUserId) {
      return selectedUserDetail.user
    }
    return null
  }, [data.users, selectedUserDetail, suspendUserId])

  const updateSearch = useCallback(
    (patch: Partial<typeof search>) => {
      void navigate({
        to: '/admin/users',
        search: (prev) =>
          userAdminFiltersSchema.parse({
            ...prev,
            ...patch,
          }),
      })
    },
    [navigate],
  )

  const refreshPage = useCallback(async () => {
    await router.invalidate({ sync: true })
  }, [router])

  const loadUserDetail = useCallback(async (userId: string) => {
    setSelectedUserId(userId)
    setDrawerOpen(true)
    setDetailLoading(true)
    try {
      const detail = await getUserDetailFn({ data: { id: userId } })
      setSelectedUserDetail(detail)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to load user detail right now.',
      )
      setSelectedUserDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }, [])

  const runMutation = useCallback(
    async (task: () => Promise<void>, successMessage: string) => {
      try {
        await task()
        toast.success(successMessage)
        await refreshPage()
        if (selectedUserId) {
          void loadUserDetail(selectedUserId)
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Unable to complete this action right now.',
        )
      }
    },
    [loadUserDetail, refreshPage, selectedUserId],
  )

  const adminCount = data.users.filter((entry) => entry.role === 'admin').length
  const suspendedCount = data.users.filter(
    (entry) => entry.status === 'suspended',
  ).length
  const verifiedCount = data.users.filter((entry) => entry.emailVerified).length

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="User Management Console"
        description="Manage account lifecycle, role access, sessions, and audit history from one administrative workspace."
        actions={
          <UserCreateDialog
            onSubmit={async (payload) => {
              try {
                await createUserFn({ data: payload })
                toast.success('User account created.')
                await refreshPage()
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : 'Unable to create user account right now.',
                )
                throw error
              }
            }}
          />
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Users In Scope"
          value={data.users.length}
          description={`Page ${data.page} of ${data.totalPages}`}
          icon={Users2}
          tone="neutral"
        />
        <StatCard
          label="Admin Accounts"
          value={adminCount}
          description="Accounts with elevated permissions."
          icon={ShieldCheck}
          tone="info"
        />
        <StatCard
          label="Suspended"
          value={suspendedCount}
          description="Accounts currently blocked from access."
          icon={Shield}
          tone={suspendedCount > 0 ? 'warning' : 'neutral'}
        />
        <StatCard
          label="Email Verified"
          value={`${verifiedCount}/${data.users.length || 0}`}
          description="Verification ratio for accounts on this page."
          icon={ShieldCheck}
          tone="success"
        />
      </div>

      <UserFilters
        query={data.filters.query}
        role={data.filters.role}
        status={data.filters.status}
        emailVerified={data.filters.emailVerified}
        fromDate={data.filters.fromDate}
        toDate={data.filters.toDate}
        pageSize={data.filters.pageSize}
        sort={data.filters.sort}
        onChange={(next) => updateSearch(next)}
      />

      <Tabs
        defaultValue="directory"
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as 'directory' | 'sessions' | 'audit')
        }
      >
        <TabsList variant="line">
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4">
          <UsersTable
            users={data.users}
            currentUserId={data.currentUserId}
            onOpenDetail={loadUserDetail}
            onRoleChange={(id, role) =>
              void runMutation(
                async () => {
                  await setUserRoleFn({ data: { id, role } })
                },
                'User role updated.',
              )
            }
            onSuspend={(id) => setSuspendUserId(id)}
            onReactivate={(id) =>
              void runMutation(
                async () => {
                  await reactivateUserFn({ data: { id } })
                },
                'User account reactivated.',
              )
            }
            onRevokeSessions={(id) =>
              void runMutation(
                async () => {
                  await revokeUserSessionsFn({ data: { id } })
                },
                'User sessions revoked.',
              )
            }
            onDelete={(id) => {
              if (
                !window.confirm(
                  'Delete this account permanently? This action cannot be undone.',
                )
              ) {
                return
              }

              void runMutation(
                async () => {
                  await deleteUserFn({ data: { id } })
                },
                'User account deleted.',
              )
            }}
          />
        </TabsContent>

        <TabsContent value="sessions">
          <UserSessionsTab sessions={data.sessions} onOpenUser={loadUserDetail} />
        </TabsContent>

        <TabsContent value="audit">
          <UserAuditTab items={data.audit} onOpenUser={loadUserDetail} />
        </TabsContent>
      </Tabs>

      <div className="border-border bg-card flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3">
        <p className="text-sm text-muted-foreground">
          Showing {data.users.length} of {data.total} users
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={data.page <= 1}
            onClick={() => updateSearch({ page: data.page - 1 })}
          >
            Previous
          </Button>
          <p className="text-xs text-muted-foreground">
            Page {data.page} / {data.totalPages}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={data.page >= data.totalPages}
            onClick={() => updateSearch({ page: data.page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>

      <UserDetailDrawer
        open={drawerOpen}
        detail={selectedUserDetail}
        isLoading={detailLoading}
        currentUserId={data.currentUserId}
        onOpenChange={setDrawerOpen}
        onToggleRole={() => {
          if (!selectedUserDetail?.user) return
          const nextRole =
            selectedUserDetail.user.role === 'admin' ? 'user' : 'admin'
          void runMutation(
            async () => {
              await setUserRoleFn({
                data: { id: selectedUserDetail.user.id, role: nextRole },
              })
            },
            `Role updated to ${nextRole}.`,
          )
        }}
        onToggleStatus={() => {
          if (!selectedUserDetail?.user) return

          if (selectedUserDetail.user.status === 'suspended') {
            void runMutation(
              async () => {
                await reactivateUserFn({ data: { id: selectedUserDetail.user.id } })
              },
              'User account reactivated.',
            )
            return
          }

          setSuspendUserId(selectedUserDetail.user.id)
        }}
        onRevokeSessions={() => {
          if (!selectedUserDetail?.user) return
          void runMutation(
            async () => {
              await revokeUserSessionsFn({ data: { id: selectedUserDetail.user.id } })
            },
            'User sessions revoked.',
          )
        }}
        onDelete={() => {
          if (!selectedUserDetail?.user) return
          if (
            !window.confirm(
              'Delete this account permanently? This action cannot be undone.',
            )
          ) {
            return
          }

          void runMutation(
            async () => {
              await deleteUserFn({ data: { id: selectedUserDetail.user.id } })
              setDrawerOpen(false)
            },
            'User account deleted.',
          )
        }}
      />

      <UserSuspendDialog
        open={Boolean(suspendUserId)}
        userName={suspendTarget?.name}
        onOpenChange={(open) => {
          if (!open) {
            setSuspendUserId(null)
          }
        }}
        onSubmit={async (reason) => {
          if (!suspendUserId) return

          await runMutation(
            async () => {
              await suspendUserFn({ data: { id: suspendUserId, reason } })
              setSuspendUserId(null)
            },
            'User account suspended.',
          )
        }}
      />
    </section>
  )
}
