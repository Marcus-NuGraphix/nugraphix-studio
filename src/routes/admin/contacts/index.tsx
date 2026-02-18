import { createFileRoute, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useCallback, useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { contactAdminFiltersSchema } from '@/features/contact/model/filters'
import {
  addContactNoteFn,
  assignContactFn,
  getAdminContactsFn,
  getContactDetailFn,
  getContactStatsFn,
  updateContactStatusFn,
} from '@/features/contact/server/admin-contacts'
import { ContactDetailDrawer } from '@/features/contact/ui/admin/contact-detail-drawer'
import { ContactFilters } from '@/features/contact/ui/admin/contact-filters'
import { ContactStatsGrid } from '@/features/contact/ui/admin/contact-stats-grid'
import { ContactsTable } from '@/features/contact/ui/admin/contacts-table'

const contactsSearchSchema = contactAdminFiltersSchema.partial()

export const Route = createFileRoute('/admin/contacts/')({
  validateSearch: (search) => contactsSearchSchema.parse(search),
  loaderDeps: ({ search }) => contactAdminFiltersSchema.parse(search),
  loader: async ({ deps }) => {
    const [listing, stats] = await Promise.all([
      getAdminContactsFn({ data: deps }),
      getContactStatsFn(),
    ])

    return {
      contacts: listing.contacts.map((entry) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt),
      })),
      total: listing.total,
      page: listing.page,
      pageSize: listing.pageSize,
      totalPages: listing.totalPages,
      filters: listing.filters,
      stats,
    }
  },
  component: AdminContactsPage,
})

function AdminContactsPage() {
  const router = useRouter()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const data = Route.useLoaderData()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [selectedContactDetail, setSelectedContactDetail] =
    useState<Awaited<ReturnType<typeof getContactDetailFn>> | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const updateSearch = useCallback(
    (patch: Partial<typeof search>) => {
      void navigate({
        to: '/admin/contacts',
        search: (prev) =>
          contactAdminFiltersSchema.parse({
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

  const loadContactDetail = useCallback(async (contactId: string) => {
    setSelectedContactId(contactId)
    setDrawerOpen(true)
    setDetailLoading(true)
    try {
      const detail = await getContactDetailFn({ data: { id: contactId } })
      setSelectedContactDetail({
        ...detail,
        contact: detail.contact
          ? {
              ...detail.contact,
              createdAt: new Date(detail.contact.createdAt),
              updatedAt: new Date(detail.contact.updatedAt),
            }
          : null,
      })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to load contact details right now.',
      )
      setSelectedContactDetail(null)
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
        if (selectedContactId) {
          await loadContactDetail(selectedContactId)
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Unable to complete this action right now.',
        )
      }
    },
    [loadContactDetail, refreshPage, selectedContactId],
  )

  const assignedCount = useMemo(
    () => data.contacts.filter((entry) => entry.assignedTo !== null).length,
    [data.contacts],
  )

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="Contact Pipeline Console"
        description="Manage inbound inquiries, assignment ownership, and follow-up outcomes from one CRM surface."
      />

      <ContactStatsGrid stats={data.stats} />

      <ContactFilters
        query={data.filters.query}
        status={data.filters.status}
        serviceInterest={data.filters.serviceInterest}
        urgency={data.filters.urgency}
        assignment={data.filters.assignment}
        fromDate={data.filters.fromDate}
        toDate={data.filters.toDate}
        sort={data.filters.sort}
        pageSize={data.filters.pageSize}
        onChange={(next) => updateSearch(next)}
      />

      <ContactsTable contacts={data.contacts} onOpenDetail={loadContactDetail} />

      <div className="border-border bg-card flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3">
        <p className="text-sm text-muted-foreground">
          Showing {data.contacts.length} of {data.total} leads on this page, with{' '}
          {assignedCount} assigned.
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

      <ContactDetailDrawer
        open={drawerOpen}
        detail={selectedContactDetail}
        isLoading={detailLoading}
        onOpenChange={(open) => {
          setDrawerOpen(open)
          if (!open) {
            setSelectedContactId(null)
            setSelectedContactDetail(null)
          }
        }}
        onStatusChange={(status) => {
          if (!selectedContactId) return Promise.resolve()
          return runMutation(
            async () => {
              await updateContactStatusFn({ data: { id: selectedContactId, status } })
            },
            'Contact status updated.',
          )
        }}
        onAssign={(assignedTo) => {
          if (!selectedContactId) return Promise.resolve()
          return runMutation(
            async () => {
              await assignContactFn({ data: { id: selectedContactId, assignedTo } })
            },
            assignedTo ? 'Contact assigned successfully.' : 'Contact unassigned.',
          )
        }}
        onAddNote={(note) => {
          if (!selectedContactId) return Promise.resolve()
          return runMutation(
            async () => {
              await addContactNoteFn({ data: { id: selectedContactId, note } })
            },
            'Note added successfully.',
          )
        }}
      />
    </section>
  )
}
