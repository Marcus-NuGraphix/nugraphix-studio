import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { useState } from 'react'
import appCss from '../styles.css?url'
import { themeScript } from '@/components/theme/theme-script'

import {
  BrandProvider,
  getBrandMetaDescription,
  getBrandPageTitle,
} from '@/components/brand'
import { ErrorComponent } from '@/components/errors/error-component'
import { NotFound } from '@/components/errors/not-found'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export const Route = createRootRoute({
  errorComponent: ({ error, reset }) => (
    <ErrorComponent error={error} reset={reset} />
  ),
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: getBrandPageTitle(),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(),
      },
      {
        property: 'og:site_name',
        content: getBrandPageTitle(),
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'theme-color',
        content: '#0f91b2',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  )

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
          suppressHydrationWarning
        />
      </head>
      <body>
        <ThemeProvider>
          <BrandProvider>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>{children}</TooltipProvider>
              {import.meta.env.DEV ? (
                <TanStackDevtools
                  config={{
                    position: 'bottom-right',
                  }}
                  plugins={[
                    {
                      name: 'TanStack Query',
                      render: <ReactQueryDevtoolsPanel />,
                      defaultOpen: true,
                    },
                    {
                      name: 'Tanstack Router',
                      render: <TanStackRouterDevtoolsPanel />,
                    },
                  ]}
                />
              ) : null}
            </QueryClientProvider>
            <Toaster closeButton position="top-center" />
          </BrandProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
