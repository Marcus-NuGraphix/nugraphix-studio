import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_legal')({
  head: () => ({
    meta: [
      {
        title: 'Authentication',
      },
    ],
  }),
  component: LegalRouteLayout,
})

function LegalRouteLayout() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto flex w-full max-w-5xl flex-1 items-center py-8 md:py-12">
          <Outlet />
        </section>
      </div>
    </main>
  )
}
