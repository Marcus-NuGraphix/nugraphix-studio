import { createFileRoute } from '@tanstack/react-router'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { ContactPage } from '@/features/contact'

export const Route = createFileRoute('/_public/contact/')({
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Contact'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Start a structured discovery conversation with Nu Graphix about your operational systems goals.',
        ),
      },
    ],
  }),
  component: ContactPage,
})
