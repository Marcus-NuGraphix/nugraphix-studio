export const contactServiceInterestValues = [
  'systems-architecture',
  'workflow-automation',
  'platform-development',
  'reporting-intelligence',
  'integration-modernization',
  'technical-advisory',
  'discovery-consultation',
  'other',
] as const

export const contactPropertyTypeValues = [
  'small-business',
  'mid-market',
  'multi-site-operations',
  'field-operations',
  'digital-product-team',
  'other',
] as const

export const contactUrgencyValues = [
  'immediate',
  'this-month',
  'this-quarter',
  'planning',
] as const

export const contactPreferredContactValues = [
  'phone',
  'email',
  'whatsapp',
] as const

export type ContactServiceInterest =
  (typeof contactServiceInterestValues)[number]
export type ContactPropertyType = (typeof contactPropertyTypeValues)[number]
export type ContactUrgency = (typeof contactUrgencyValues)[number]
export type ContactPreferredContactMethod =
  (typeof contactPreferredContactValues)[number]

export const serviceInterestLabels: Record<ContactServiceInterest, string> = {
  'systems-architecture': 'Systems Architecture',
  'workflow-automation': 'Workflow Automation',
  'platform-development': 'Custom Platform Development',
  'reporting-intelligence': 'Reporting and Intelligence',
  'integration-modernization': 'Integration and Modernization',
  'technical-advisory': 'Technical Advisory Retainer',
  'discovery-consultation': 'Discovery Consultation',
  other: 'Other',
}

export const propertyTypeLabels: Record<ContactPropertyType, string> = {
  'small-business': 'Small Business',
  'mid-market': 'Mid-Market Operations',
  'multi-site-operations': 'Multi-Site Operations',
  'field-operations': 'Field Operations Team',
  'digital-product-team': 'Digital Product Team',
  other: 'Other',
}

export const urgencyLabels: Record<ContactUrgency, string> = {
  immediate: 'Immediate Priority',
  'this-month': 'This Month',
  'this-quarter': 'This Quarter',
  planning: 'Planning Stage',
}

export const preferredContactLabels: Record<
  ContactPreferredContactMethod,
  string
> = {
  phone: 'Phone Call',
  email: 'Email',
  whatsapp: 'WhatsApp',
}
