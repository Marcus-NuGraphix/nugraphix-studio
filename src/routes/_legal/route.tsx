import { Outlet, createFileRoute } from '@tanstack/react-router'
import { getBrandPageTitle } from '@/components/brand'
import { SiteFooter } from '@/components/navigation/site-footer'
import { SiteHeader } from '@/components/navigation/site-header'

export const Route = createFileRoute('/_legal')({
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
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto flex w-full max-w-5xl flex-1 py-8 md:py-12">
          <div className="w-full">
            <Outlet />
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  )
}
