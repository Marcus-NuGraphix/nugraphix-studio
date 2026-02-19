import { createFileRoute } from '@tanstack/react-router'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_legal/privacy-policy/')({
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Privacy Policy'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Privacy policy for Nu Graphix Studio and related service interactions.',
        ),
      },
    ],
  }),
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  return (
    <Card className="border-border bg-card shadow-none">
      <CardHeader>
        <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        <p className="text-sm text-muted-foreground">
          Last updated: February 17, 2026
        </p>
      </CardHeader>
      <CardContent className="space-y-5 text-sm leading-7 text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">
            1. Information We Collect
          </h2>
          <p>
            We collect the information required to respond to inquiries,
            deliver services, and maintain secure account access. This may
            include name, email, contact details, and communication history.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">
            2. How We Use Information
          </h2>
          <p>
            Nu Graphix uses collected information to provide consulting services,
            communicate project updates, improve delivery quality, and maintain
            operational security controls.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">
            3. Data Protection
          </h2>
          <p>
            We apply access controls, secure infrastructure, and structured
            logging practices to protect data from unauthorized access,
            disclosure, or misuse.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">
            4. Contact
          </h2>
          <p>
            For privacy-related questions, contact us at{' '}
            <a
              href="mailto:hello@nugraphix.co.za"
              className="font-medium text-foreground underline underline-offset-4"
            >
              hello@nugraphix.co.za
            </a>
            .
          </p>
        </section>
      </CardContent>
    </Card>
  )
}
