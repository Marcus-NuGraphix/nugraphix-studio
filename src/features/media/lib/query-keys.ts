import type { MediaAssetFiltersInput } from '@/features/media/model/filters'

export const mediaQueryKeys = {
  all: ['media'] as const,
  adminAssets: (filters: Partial<MediaAssetFiltersInput> = {}) =>
    [...mediaQueryKeys.all, 'admin', 'assets', filters] as const,
  asset: (id: string) => [...mediaQueryKeys.all, 'asset', id] as const,
}
