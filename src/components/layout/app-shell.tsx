import type { ReactNode } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface AppShellProps {
  sidebar?: ReactNode
  topBar?: ReactNode
  children: ReactNode
  className?: string
  mainClassName?: string
}

export function AppShell({
  sidebar,
  topBar,
  children,
  className,
  mainClassName,
}: AppShellProps) {
  const isMobile = useIsMobile()

  return (
    <SidebarProvider
      className={cn('bg-muted/40 text-foreground min-h-screen', className)}
    >
      {sidebar}
      <SidebarInset>
        {topBar ? (
          <header
            className={cn(
              'border-border bg-background/95 border-b',
              !isMobile && 'sticky top-0 z-40 backdrop-blur',
            )}
          >
            {topBar}
          </header>
        ) : null}
        <main
          className={cn(
            'flex flex-1 flex-col',
            isMobile ? 'p-4' : 'p-6',
            mainClassName,
          )}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
