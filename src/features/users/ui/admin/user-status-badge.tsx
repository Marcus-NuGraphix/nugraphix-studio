import type { UserStatus } from '@/features/users/model/filters'
import { Badge } from '@/components/ui/badge'

export function UserStatusBadge({ status }: { status: UserStatus }) {
  if (status === 'active') {
    return (
      <Badge className="border border-primary/30 bg-primary/10 text-primary">
        Active
      </Badge>
    )
  }

  if (status === 'invited') {
    return (
      <Badge className="border border-muted-foreground/30 bg-muted text-foreground">
        Invited
      </Badge>
    )
  }

  return (
    <Badge className="border border-destructive/35 bg-destructive/10 text-destructive">
      Suspended
    </Badge>
  )
}
