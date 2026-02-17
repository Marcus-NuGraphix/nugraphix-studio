import { brandConfig } from '@/components/brand/brand.config'

const trimTitle = (value: string) => value.trim().replace(/\s+/g, ' ')

export const getBrandPageTitle = (pageTitle?: string) => {
  if (!pageTitle) return brandConfig.seo.defaultTitle
  return brandConfig.seo.titleTemplate.replace('%s', trimTitle(pageTitle))
}

export const getBrandMetaDescription = (description?: string) =>
  description?.trim() || brandConfig.seo.defaultDescription

export const getBrandSiteOrigin = () => brandConfig.siteUrl.replace(/\/$/, '')
