import type { UserAdminFiltersInput } from '@/features/users/model/filters'

export const usersQueryKeys = {
  all: ['users'] as const,
  adminList: (filters: Partial<UserAdminFiltersInput> = {}) =>
    [...usersQueryKeys.all, 'admin', 'list', filters] as const,
  adminSessions: (limit = 200) =>
    [...usersQueryKeys.all, 'admin', 'sessions', limit] as const,
  adminAudit: (limit = 200) =>
    [...usersQueryKeys.all, 'admin', 'audit', limit] as const,
  detail: (id: string) =>
    [...usersQueryKeys.all, 'admin', 'detail', id] as const,
  myAccount: () => [...usersQueryKeys.all, 'account', 'me'] as const,
}
