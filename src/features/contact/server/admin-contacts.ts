import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { contactAdminFiltersSchema } from '@/features/contact/model/filters'
import { contactSubmissionStatusValues } from '@/features/contact/model/types'
import { contactRepository } from '@/features/contact/server/contact-repository'
import { logger } from '@/lib/server'

const contactsLogger = logger.child({ domain: 'contacts-admin' })

const getAdminSession = async () => {
  const { requireAdmin } = await import('@/features/auth/server/session.server')
  return requireAdmin()
}

const adminFiltersInputSchema = contactAdminFiltersSchema.partial().default({})

export const getAdminContactsFn = createServerFn({ method: 'GET' })
  .inputValidator(adminFiltersInputSchema)
  .handler(async ({ data }) => {
    await getAdminSession()
    const normalized = contactAdminFiltersSchema.parse(data)
    const result = await contactRepository.listAdminContacts(normalized)

    return {
      contacts: result.contacts,
      total: result.total,
      page: normalized.page,
      pageSize: normalized.pageSize,
      totalPages: Math.max(1, Math.ceil(result.total / normalized.pageSize)),
      filters: normalized,
    }
  })

export const getContactDetailFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await getAdminSession()
    const [contact, assignees] = await Promise.all([
      contactRepository.findContactById(data.id),
      contactRepository.listAssignableAdmins(),
    ])

    return { contact, assignees }
  })

export const updateContactStatusFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string().min(1),
      status: z.enum(contactSubmissionStatusValues),
    }),
  )
  .handler(async ({ data }) => {
    await getAdminSession()

    const existing = await contactRepository.findContactById(data.id)
    if (!existing) {
      throw new Error('Contact submission not found.')
    }

    await contactRepository.updateContactStatus({
      id: data.id,
      status: data.status,
    })
    contactsLogger.info('contacts.status.updated', {
      contactId: data.id,
      status: data.status,
    })
    return { success: true }
  })

export const addContactNoteFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string().min(1),
      note: z.string().trim().min(3).max(4_000),
    }),
  )
  .handler(async ({ data }) => {
    const session = await getAdminSession()

    const existing = await contactRepository.findContactById(data.id)
    if (!existing) {
      throw new Error('Contact submission not found.')
    }

    const entry = `[${new Date().toISOString()}] ${session.user.name} (${session.user.email}): ${data.note}`
    const notes = [existing.notes, entry].filter(Boolean).join('\n\n')

    await contactRepository.updateContactNotes({ id: data.id, notes })
    contactsLogger.info('contacts.note.added', { contactId: data.id })
    return { success: true }
  })

export const assignContactFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string().min(1),
      assignedTo: z.string().min(1).nullable(),
    }),
  )
  .handler(async ({ data }) => {
    await getAdminSession()

    const existing = await contactRepository.findContactById(data.id)
    if (!existing) {
      throw new Error('Contact submission not found.')
    }

    if (data.assignedTo) {
      const assignees = await contactRepository.listAssignableAdmins()
      if (!assignees.some((assignee) => assignee.id === data.assignedTo)) {
        throw new Error('Selected assignee is not available.')
      }
    }

    await contactRepository.assignContact({
      id: data.id,
      assignedTo: data.assignedTo,
    })
    contactsLogger.info('contacts.assignee.updated', {
      contactId: data.id,
      assignedTo: data.assignedTo,
    })
    return { success: true }
  })

export const getContactStatsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    await getAdminSession()
    return contactRepository.getContactStats()
  },
)
