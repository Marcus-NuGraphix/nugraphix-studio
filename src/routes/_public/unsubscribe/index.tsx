import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { MarketingContainer, MarketingSection } from '@/components/marketing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  unsubscribeByTokenFn,
  unsubscribeByTokenSearchSchema,
} from '@/features/email/server/email'

const unsubscribeRouteSearchSchema = z.object({
  token: z.string().trim().optional(),
})

type UnsubscribeState =
  | { status: 'missing' | 'invalid' }
  | {
      status: 'success'
      email: string
      topic:
        | 'blog'
        | 'press'
        | 'product'
        | 'security'
        | 'account'
        | 'contact'
    }

export const Route = createFileRoute('/_public/unsubscribe/')({
  validateSearch: (search) => unsubscribeRouteSearchSchema.parse(search),
  loaderDeps: ({ search }) => unsubscribeRouteSearchSchema.parse(search),
  loader: async ({ deps }) => {
    const token = deps.token?.trim()

    if (!token) {
      return { result: { status: 'missing' } satisfies UnsubscribeState }
    }

    const validated = unsubscribeByTokenSearchSchema.safeParse({ token })
    if (!validated.success) {
      return { result: { status: 'invalid' } satisfies UnsubscribeState }
    }

    try {
      const response = await unsubscribeByTokenFn({
        data: { token: validated.data.token },
      })
      return {
        result: {
          status: 'success',
          email: response.email,
          topic: response.topic,
        } satisfies UnsubscribeState,
      }
    } catch {
      return { result: { status: 'invalid' } satisfies UnsubscribeState }
    }
  },
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Unsubscribe'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          'Manage Nu Graphix editorial email subscriptions securely with one-click unsubscribe tokens.',
        ),
      },
    ],
  }),
  component: UnsubscribePage,
})

function UnsubscribePage() {
  const { result } = Route.useLoaderData()

  const title =
    result.status === 'success'
      ? 'You have been unsubscribed'
      : 'Unable to process unsubscribe token'
  const description =
    result.status === 'success'
      ? `Email updates for ${result.topic} are now disabled for ${result.email}.`
      : 'The unsubscribe link is missing or invalid. You can still manage preferences from your account.'

  return (
    <MarketingContainer className="py-12">
      <MarketingSection title="Email Preferences" description={description}>
        <Card className="mx-auto max-w-2xl border-border bg-card shadow-none">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {result.status === 'success' ? (
              <p>
                If this was accidental, you can resubscribe anytime from the blog
                and newsroom subscription forms.
              </p>
            ) : (
              <p>
                For active account users, preference controls remain available in
                the account notifications panel.
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Button asChild>
                <Link to="/blog">Visit Blog</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contact">Contact Nu Graphix</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/login" search={{ redirect: '/account/notifications' }}>
                  Account Notifications
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </MarketingSection>
    </MarketingContainer>
  )
}
