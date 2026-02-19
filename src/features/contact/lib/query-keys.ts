import type { ContactAdminFiltersInput } from '@/features/contact/model/filters'

export const contactQueryKeys = {
  all: ['contacts'] as const,
  adminList: (filters: Partial<ContactAdminFiltersInput> = {}) =>
    [...contactQueryKeys.all, 'admin', 'list', filters] as const,
  detail: (contactId: string) =>
    [...contactQueryKeys.all, 'admin', 'detail', contactId] as const,
  stats: () => [...contactQueryKeys.all, 'admin', 'stats'] as const,
}
