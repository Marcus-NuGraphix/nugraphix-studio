import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  isNotNull,
  isNull,
  lte,
  or,
  sql,
} from 'drizzle-orm'
import type { ContactAdminFiltersInput } from '@/features/contact/model/filters'
import type {
  ContactAssigneeSummary,
  ContactStats,
  ContactSubmissionDetail,
  ContactSubmissionStatus,
  ContactSubmissionSummary,
} from '@/features/contact/model/types'
import type { SQL } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contactSubmission, user } from '@/lib/db/schema'

const count = sql<number>`count(*)::int`

const mapContactRecord = (record: {
  id: string
  name: string
  email: string
  phone: string
  suburb: string
  serviceInterest: string
  propertyType: string
  urgency: string
  preferredContactMethod: string
  bestContactTime: string | null
  subject: string
  message: string
  sourcePath: string
  status: ContactSubmissionStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
  assignee: { id: string; name: string; email: string } | null
}): ContactSubmissionSummary => ({
  id: record.id,
  name: record.name,
  email: record.email,
  phone: record.phone,
  suburb: record.suburb,
  serviceInterest:
    record.serviceInterest as ContactSubmissionSummary['serviceInterest'],
  propertyType: record.propertyType as ContactSubmissionSummary['propertyType'],
  urgency: record.urgency as ContactSubmissionSummary['urgency'],
  preferredContactMethod:
    record.preferredContactMethod as ContactSubmissionSummary['preferredContactMethod'],
  bestContactTime: record.bestContactTime,
  subject: record.subject,
  message: record.message,
  sourcePath: record.sourcePath,
  status: record.status,
  notes: record.notes,
  assignedTo: record.assignee,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
})

const listAdminContacts = async (filters: ContactAdminFiltersInput) => {
  const whereConditions: Array<SQL<unknown>> = []

  if (filters.query) {
    const queryValue = `%${filters.query}%`
    whereConditions.push(
      or(
        ilike(contactSubmission.name, queryValue),
        ilike(contactSubmission.email, queryValue),
        ilike(contactSubmission.phone, queryValue),
        ilike(contactSubmission.suburb, queryValue),
        ilike(contactSubmission.subject, queryValue),
        ilike(contactSubmission.message, queryValue),
      )!,
    )
  }

  if (filters.status) {
    whereConditions.push(eq(contactSubmission.status, filters.status))
  }

  if (filters.serviceInterest) {
    whereConditions.push(
      eq(contactSubmission.serviceInterest, filters.serviceInterest),
    )
  }

  if (filters.urgency) {
    whereConditions.push(eq(contactSubmission.urgency, filters.urgency))
  }

  if (filters.assignment === 'assigned') {
    whereConditions.push(isNotNull(contactSubmission.assignedTo))
  }

  if (filters.assignment === 'unassigned') {
    whereConditions.push(isNull(contactSubmission.assignedTo))
  }

  if (filters.fromDate) {
    whereConditions.push(
      gte(contactSubmission.createdAt, new Date(filters.fromDate)),
    )
  }

  if (filters.toDate) {
    whereConditions.push(
      lte(contactSubmission.createdAt, new Date(filters.toDate)),
    )
  }

  const where = whereConditions.length > 0 ? and(...whereConditions) : undefined
  const orderBy =
    filters.sort === 'created-asc'
      ? [asc(contactSubmission.createdAt)]
      : filters.sort === 'updated-desc'
        ? [desc(contactSubmission.updatedAt)]
        : [desc(contactSubmission.createdAt)]

  const [rows, [{ value: total }]] = await Promise.all([
    db.query.contactSubmission.findMany({
      where,
      orderBy,
      limit: filters.pageSize,
      offset: (filters.page - 1) * filters.pageSize,
      with: {
        assignee: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    db.select({ value: count }).from(contactSubmission).where(where),
  ])

  return {
    contacts: rows.map((row) => mapContactRecord(row)),
    total,
  }
}

const findContactById = async (
  id: string,
): Promise<ContactSubmissionDetail | null> => {
  const row = await db.query.contactSubmission.findFirst({
    where: eq(contactSubmission.id, id),
    with: {
      assignee: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  return row ? mapContactRecord(row) : null
}

const updateContactStatus = async ({
  id,
  status,
}: {
  id: string
  status: ContactSubmissionStatus
}) =>
  db
    .update(contactSubmission)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(contactSubmission.id, id))

const updateContactNotes = async ({
  id,
  notes,
}: {
  id: string
  notes: string
}) =>
  db
    .update(contactSubmission)
    .set({
      notes,
      updatedAt: new Date(),
    })
    .where(eq(contactSubmission.id, id))

const assignContact = async ({
  id,
  assignedTo,
}: {
  id: string
  assignedTo: string | null
}) =>
  db
    .update(contactSubmission)
    .set({
      assignedTo,
      updatedAt: new Date(),
    })
    .where(eq(contactSubmission.id, id))

const listAssignableAdmins = async (): Promise<Array<ContactAssigneeSummary>> =>
  db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
    })
    .from(user)
    .where(eq(user.role, 'admin'))
    .orderBy(asc(user.name))

const getContactStats = async (): Promise<ContactStats> => {
  const [statusRows, [assignedRow], [unassignedRow], [totalRow]] =
    await Promise.all([
      db
        .select({
          status: contactSubmission.status,
          value: count,
        })
        .from(contactSubmission)
        .groupBy(contactSubmission.status),
      db
        .select({ value: count })
        .from(contactSubmission)
        .where(isNotNull(contactSubmission.assignedTo)),
      db
        .select({ value: count })
        .from(contactSubmission)
        .where(isNull(contactSubmission.assignedTo)),
      db.select({ value: count }).from(contactSubmission),
    ])

  const byStatus: Record<ContactSubmissionStatus, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    'closed-won': 0,
    'closed-lost': 0,
  }

  for (const row of statusRows) {
    byStatus[row.status] = row.value
  }

  return {
    total: totalRow.value,
    new: byStatus.new,
    contacted: byStatus.contacted,
    qualified: byStatus.qualified,
    proposal: byStatus.proposal,
    closedWon: byStatus['closed-won'],
    closedLost: byStatus['closed-lost'],
    assigned: assignedRow.value,
    unassigned: unassignedRow.value,
  }
}

export const contactRepository = {
  assignContact,
  findContactById,
  getContactStats,
  listAdminContacts,
  listAssignableAdmins,
  updateContactNotes,
  updateContactStatus,
}
