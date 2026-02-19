export type BrandSocialChannel =
  | 'x'
  | 'linkedin'
  | 'facebook'
  | 'instagram'
  | 'github'
  | 'youtube'

export type BrandSocialLinks = Partial<Record<BrandSocialChannel, string>>

export interface BrandAssets {
  logoPath: string
  iconPath: string
  ogImagePath: string
}

export interface BrandSeoConfig {
  defaultTitle: string
  titleTemplate: string
  defaultDescription: string
}

export interface BrandRssConfig {
  title: string
  description: string
}

export interface BrandEmailConfig {
  fromAddressDefault: string
}

export interface BrandConfig {
  legalName?: string
  companyName: string
  siteName: string
  productName: string
  tagline: string
  description: string
  siteUrl: string
  contactEmail: string
  serviceName: string
  dashboardLabel: string
  dashboardSubLabel: string
  social: BrandSocialLinks
  assets: BrandAssets
  seo: BrandSeoConfig
  rss: BrandRssConfig
  email: BrandEmailConfig
}
