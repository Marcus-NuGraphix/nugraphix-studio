import type {
  ContactPreferredContactMethod,
  ContactPropertyType,
  ContactServiceInterest,
  ContactUrgency,
} from '@/features/contact/model/lead-form'

export const contactSubmissionStatusValues = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'closed-won',
  'closed-lost',
] as const

export type ContactSubmissionStatus =
  (typeof contactSubmissionStatusValues)[number]

export interface ContactAssigneeSummary {
  id: string
  name: string
  email: string
}

export interface ContactSubmissionSummary {
  id: string
  name: string
  email: string
  phone: string
  suburb: string
  serviceInterest: ContactServiceInterest
  propertyType: ContactPropertyType
  urgency: ContactUrgency
  preferredContactMethod: ContactPreferredContactMethod
  bestContactTime: string | null
  subject: string
  message: string
  sourcePath: string
  status: ContactSubmissionStatus
  notes: string | null
  assignedTo: ContactAssigneeSummary | null
  createdAt: Date
  updatedAt: Date
}

export interface ContactSubmissionDetail extends ContactSubmissionSummary {}

export interface ContactStats {
  total: number
  new: number
  contacted: number
  qualified: number
  proposal: number
  closedWon: number
  closedLost: number
  assigned: number
  unassigned: number
}
