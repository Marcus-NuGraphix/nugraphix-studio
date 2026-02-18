import { Link, Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'

import { ArrowLeft } from 'lucide-react'
import { BrandLockup, getBrandPageTitle } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_auth')({
  head: () => ({
    meta: [
      {
        title: getBrandPageTitle('Authentication'),
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isAccountRoute =
    pathname === '/account' || pathname.startsWith('/account/')

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <BrandLockup compact />

          <Button asChild variant="secondary">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <section
          className={cn(
            'mx-auto flex w-full flex-1 py-8 md:py-12',
            isAccountRoute ? 'max-w-6xl items-start' : 'max-w-5xl items-center',
          )}
        >
          <Outlet />
        </section>
      </div>
    </main>
  )
}
