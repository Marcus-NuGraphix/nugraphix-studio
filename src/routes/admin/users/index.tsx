import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { EmptyState } from '@/components/empties/empty-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/users/')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Account administration routes are scaffolded and ready for server
          function wiring.
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>
            Manage roles, account status, and security lifecycle actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Users}
            title="User table wiring pending"
            description="Connect this route to users query functions and table components."
          />
        </CardContent>
      </Card>
    </section>
  )
}
