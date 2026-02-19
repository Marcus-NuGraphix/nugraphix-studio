import type { EmailAdminFiltersInput } from '@/features/email/schemas/admin'

export const emailQueryKeys = {
  all: ['email'] as const,
  preferences: () => [...emailQueryKeys.all, 'preferences'] as const,
  adminMessages: (filters: Partial<EmailAdminFiltersInput> = {}) =>
    [...emailQueryKeys.all, 'admin', 'messages', filters] as const,
  adminOverview: () => [...emailQueryKeys.all, 'admin', 'overview'] as const,
  adminDetail: (id: string, limit = 50) =>
    [...emailQueryKeys.all, 'admin', 'detail', id, limit] as const,
}
