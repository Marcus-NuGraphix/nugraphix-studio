import type { BrandConfig } from '@/components/brand/brand.types'

export const brandConfig: BrandConfig = {
  legalName: 'Nu Graphix (Pty) Ltd',
  companyName: 'Nu Graphix',
  siteName: 'Nu Graphix',
  productName: 'Nu Graphix Studio',

  tagline: 'Structured digital systems for operationally complex businesses.',

  description:
    'Nu Graphix is a South African digital systems consultancy and vertical SaaS builder. We design and deploy structured software systems that eliminate manual processes, centralize operations, improve reporting transparency, and unlock measurable business growth.',

  siteUrl: 'https://nugraphix.co.za',
  contactEmail: 'hello@nugraphix.co.za',

  serviceName: 'Digital Systems Consulting',
  dashboardLabel: 'Studio',
  dashboardSubLabel: 'Internal Operating System',

  social: {
    x: 'https://x.com/nugraphix',
    linkedin: 'https://linkedin.com/company/nugraphix',
    github: 'https://github.com/Marcus-NuGraphix',
  },

  assets: {
    logoPath: '/logo.svg',
    iconPath: '/favicon.ico',
    ogImagePath: '/og-image.png', // create later
  },

  seo: {
    defaultTitle: 'Nu Graphix — Structured Digital Systems',
    titleTemplate: '%s | Nu Graphix Studio',
    defaultDescription:
      'Nu Graphix designs and deploys structured digital systems for operationally complex SMEs in South Africa. We replace spreadsheets, manual workflows, and reporting chaos with scalable, intelligent software.',
  },

  rss: {
    title: 'Nu Graphix Studio — Systems & Full-Stack Engineering',
    description:
      'Insights on structured software architecture, operational systems, full-stack development, and building vertical SaaS platforms.',
  },

  email: {
    fromAddressDefault: 'Nu Graphix <no-reply@nugraphix.co.za>',
  },
}
