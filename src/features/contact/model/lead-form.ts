export const contactServiceInterestValues = [
  'armed-response',
  'alarm-monitoring',
  'cctv-monitoring',
  'guarding-services',
  'community-precinct',
  'medical-response',
  'general-security-assessment',
  'other',
] as const

export const contactPropertyTypeValues = [
  'home',
  'business',
  'estate-complex',
  'industrial',
  'plot-farm',
  'other',
] as const

export const contactUrgencyValues = [
  'emergency',
  'same-day',
  'this-week',
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
  'armed-response': 'Armed Response',
  'alarm-monitoring': 'Alarm Monitoring',
  'cctv-monitoring': 'CCTV Monitoring',
  'guarding-services': 'Guarding Services',
  'community-precinct': 'Community Precinct',
  'medical-response': 'Medical Response',
  'general-security-assessment': 'General Security Assessment',
  other: 'Other',
}

export const propertyTypeLabels: Record<ContactPropertyType, string> = {
  home: 'Home',
  business: 'Business',
  'estate-complex': 'Estate or Complex',
  industrial: 'Industrial / Warehouse',
  'plot-farm': 'Plot / Farm',
  other: 'Other',
}

export const urgencyLabels: Record<ContactUrgency, string> = {
  emergency: 'Emergency',
  'same-day': 'Same Day',
  'this-week': 'This Week',
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
