import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const operationsWorkspaceCards = [
  {
    title: 'Dashboard',
    description: 'Operational telemetry and release health.',
    to: '/admin/workspaces/operations/dashboard',
    cta: 'Open dashboard',
  },
  {
    title: 'Users',
    description: 'Account lifecycle, role changes, and security actions.',
    to: '/admin/workspaces/operations/users',
    cta: 'Open users',
  },
  {
    title: 'Contacts',
    description: 'Inbound lead assignment and status workflows.',
    to: '/admin/workspaces/operations/contacts',
    cta: 'Open contacts',
  },
  {
    title: 'Email',
    description: 'Delivery events, retries, and queue visibility.',
    to: '/admin/workspaces/operations/email',
    cta: 'Open email',
  },
  {
    title: 'Account',
    description: 'Profile, session, and credential controls.',
    to: '/admin/workspaces/operations/account',
    cta: 'Open account',
  },
  {
    title: 'Settings',
    description: 'System-level controls and configuration surface.',
    to: '/admin/workspaces/operations/settings',
    cta: 'Open settings',
  },
] as const

export const Route = createFileRoute('/admin/workspaces/operations/')({
  component: OperationsWorkspacePage,
})

function OperationsWorkspacePage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Operations Workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          Run day-to-day platform operations across dashboard telemetry, user
          governance, and communication workflows.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {operationsWorkspaceCards.map((card) => (
          <Card key={card.to} className="border-border bg-card shadow-none">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to={card.to}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
              >
                {card.cta}
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
