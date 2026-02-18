import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import type { EmailMessageStatus } from '@/features/email/model/types'
import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { emailAdminFiltersSchema } from '@/features/email/schemas/admin'
import {
  bulkRetryEmailsFn,
  getAdminEmailMessageDetailFn,
  getAdminEmailMessagesFn,
  getAdminEmailOverviewFn,
  retryEmailMessageFn,
} from '@/features/email/server/email'
import {
  EmailDeliveryFunnel,
  EmailDetailDrawer,
  EmailFilters,
  EmailMessagesTable,
  EmailOverviewCards,
} from '@/features/email'

const adminEmailSearchSchema = emailAdminFiltersSchema.partial().extend({
  messageId: z.string().trim().min(1).optional(),
})

export const Route = createFileRoute('/admin/email/')({
  validateSearch: (search) => adminEmailSearchSchema.parse(search),
  loaderDeps: ({ search }) => {
    const parsed = adminEmailSearchSchema.parse(search)
    return {
      filters: emailAdminFiltersSchema.parse(parsed),
      messageId: parsed.messageId,
    }
  },
  loader: async ({ deps }) => {
    const [listing, overview, detail] = await Promise.all([
      getAdminEmailMessagesFn({ data: deps.filters }),
      getAdminEmailOverviewFn(),
      deps.messageId
        ? getAdminEmailMessageDetailFn({
            data: { id: deps.messageId, limit: 100 },
          }).catch(() => null)
        : Promise.resolve(null),
    ])

    return {
      messages: listing.messages.map((entry) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt),
        sentAt: entry.sentAt ? new Date(entry.sentAt) : null,
      })),
      total: listing.total,
      page: listing.page,
      pageSize: listing.pageSize,
      totalPages: listing.totalPages,
      filters: listing.filters,
      overview,
      detail: detail
        ? {
            ...detail,
            message: {
              ...detail.message,
              createdAt: new Date(detail.message.createdAt),
              updatedAt: new Date(detail.message.updatedAt),
              sentAt: detail.message.sentAt ? new Date(detail.message.sentAt) : null,
            },
            events: detail.events.map((event) => ({
              ...event,
              occurredAt: event.occurredAt ? new Date(event.occurredAt) : null,
              createdAt: new Date(event.createdAt),
            })),
          }
        : null,
    }
  },
  component: AdminEmailPage,
})

function AdminEmailPage() {
  const router = useRouter()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const data = Route.useLoaderData()

  const [selectedIds, setSelectedIds] = useState<Array<string>>([])
  const [isBulkRetrying, setIsBulkRetrying] = useState(false)

  useEffect(() => {
    setSelectedIds((current) =>
      current.filter((id) => data.messages.some((message) => message.id === id)),
    )
  }, [data.messages])

  const updateSearch = useCallback(
    (patch: Partial<typeof search>) => {
      void navigate({
        to: '/admin/email',
        search: (prev) =>
          adminEmailSearchSchema.parse({
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

  const runAction = useCallback(
    async (task: () => Promise<void>, successMessage: string) => {
      try {
        await task()
        toast.success(successMessage)
        await refreshPage()
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Unable to complete this action right now.',
        )
      }
    },
    [refreshPage],
  )

  const selectedFailedIds = useMemo(() => {
    const failedById = new Set(
      data.messages.filter((message) => message.status === 'failed').map((m) => m.id),
    )
    return selectedIds.filter((id) => failedById.has(id))
  }, [data.messages, selectedIds])

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="Email Delivery Console"
        description="Monitor outbound delivery health, inspect provider events, and retry failed messages from one admin surface."
        actions={
          <Button
            disabled={selectedFailedIds.length === 0 || isBulkRetrying}
            onClick={() => {
              if (selectedFailedIds.length === 0) return
              setIsBulkRetrying(true)
              void runAction(
                async () => {
                  await bulkRetryEmailsFn({
                    data: { ids: selectedFailedIds },
                  })
                  setSelectedIds([])
                },
                'Bulk retry operation complete.',
              ).finally(() => setIsBulkRetrying(false))
            }}
          >
            {isBulkRetrying
              ? 'Retrying...'
              : `Retry Selected (${selectedFailedIds.length})`}
          </Button>
        }
      />

      <EmailOverviewCards overview={data.overview} />

      <EmailDeliveryFunnel
        overview={data.overview}
        activeStatus={data.filters.status}
        onStageSelect={(status) =>
          updateSearch({
            status: status as EmailMessageStatus | undefined,
            page: 1,
          })
        }
      />

      <EmailFilters
        query={data.filters.query}
        status={data.filters.status}
        topic={data.filters.topic}
        pageSize={data.filters.pageSize}
        onChange={(next) => updateSearch(next)}
      />

      <EmailMessagesTable
        messages={data.messages}
        selectedIds={selectedIds}
        onToggleSelect={(id, checked) => {
          setSelectedIds((current) => {
            if (checked) return Array.from(new Set([...current, id]))
            return current.filter((value) => value !== id)
          })
        }}
        onToggleSelectAll={(checked) => {
          setSelectedIds(checked ? data.messages.map((message) => message.id) : [])
        }}
        onOpenDetail={(id) => updateSearch({ messageId: id })}
        onRetry={async (id) => {
          await runAction(
            async () => {
              await retryEmailMessageFn({ data: { id } })
            },
            'Email retry queued.',
          )
        }}
      />

      <div className="border-border bg-card flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3">
        <p className="text-sm text-muted-foreground">
          Showing {data.messages.length} of {data.total} messages.
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

      <EmailDetailDrawer
        open={Boolean(search.messageId)}
        detail={data.detail}
        isLoading={false}
        onOpenChange={(open) => {
          if (!open) {
            updateSearch({ messageId: undefined })
          }
        }}
        onRetry={(id) => {
          void runAction(
            async () => {
              await retryEmailMessageFn({ data: { id } })
            },
            'Email retry queued.',
          )
        }}
      />
    </section>
  )
}
