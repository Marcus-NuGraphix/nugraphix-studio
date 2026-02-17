import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

import { ArrowLeft } from 'lucide-react'
import { BrandWordmark, getBrandPageTitle } from '@/components/brand'
import { buttonVariants } from '@/components/ui/button'

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
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <BrandWordmark compact className="text-base text-foreground" />

          <Link to="/" className={buttonVariants({ variant: 'secondary' })}>
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>

        <section className="mx-auto flex w-full max-w-5xl flex-1 items-center py-8 md:py-12">
          <Outlet />
        </section>
      </div>
    </main>
  )
}
