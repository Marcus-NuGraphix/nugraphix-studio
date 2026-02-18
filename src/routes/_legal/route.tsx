import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { getBrandPageTitle } from '@/components/brand'
import { SiteFooter } from '@/components/navigation/site-footer'
import { SiteHeader } from '@/components/navigation/site-header'
import { authClient } from '@/features/auth/client/auth-client'
import { getRoleLandingPath } from '@/features/auth/model/post-auth'
import { subscribeToEmailTopicFn } from '@/features/email/client/email'
import { getOptionalSessionFn } from '@/features/auth/server/session'

export const Route = createFileRoute('/_legal')({
  beforeLoad: async () => {
    const session = await getOptionalSessionFn()
    return { session }
  },
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Legal'),
      },
    ],
  }),
  component: LegalRouteLayout,
})

function LegalRouteLayout() {
  const { session } = Route.useRouteContext()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Signed out successfully.')
          void navigate({ to: '/' })
        },
        onError: () => {
          toast.error('Unable to sign out right now. Please try again.')
        },
      },
    })
  }

  const handleNewsletterSubscribe = async (email: string) => {
    await subscribeToEmailTopicFn({
      data: {
        email,
        topic: 'blog',
        source: 'public-footer',
      },
    })
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <SiteHeader
        session={session}
        onSignOut={handleSignOut}
        resolveRoleLandingPath={getRoleLandingPath}
      />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto flex w-full max-w-5xl flex-1 py-8 md:py-12">
          <div className="w-full">
            <Outlet />
          </div>
        </section>
      </div>
      <SiteFooter onNewsletterSubscribe={handleNewsletterSubscribe} />
    </div>
  )
}
