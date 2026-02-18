import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { SiteFooter } from '@/components/navigation/site-footer'
import { SiteHeader } from '@/components/navigation/site-header'
import { authClient } from '@/features/auth/client/auth-client'
import { getRoleLandingPath } from '@/features/auth/model/post-auth'
import { subscribeToEmailTopicFn } from '@/features/email/client/email'
import { getOptionalSessionFn } from '@/features/auth/server/session'

export const Route = createFileRoute('/_public')({
  beforeLoad: async () => {
    const session = await getOptionalSessionFn()
    return { session }
  },
  component: PublicRouteLayout,
})

function PublicRouteLayout() {
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
      <div className="flex-1">
        <SiteHeader
          session={session}
          onSignOut={handleSignOut}
          resolveRoleLandingPath={getRoleLandingPath}
        />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <SiteFooter onNewsletterSubscribe={handleNewsletterSubscribe} />
    </div>
  )
}
