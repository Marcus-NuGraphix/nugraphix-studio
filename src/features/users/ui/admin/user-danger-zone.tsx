import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function UserDangerZone({
  onRevokeSessions,
  onDelete,
  disableDelete,
}: {
  onRevokeSessions: () => void
  onDelete: () => void
  disableDelete?: boolean
}) {
  return (
    <Card className="border-destructive/40 bg-card shadow-sm ring-0">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          These actions affect account access immediately and should only be
          used for verified operational reasons.
        </p>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={onRevokeSessions}
            className="bg-background text-foreground hover:bg-muted"
          >
            Revoke All Sessions
          </Button>

          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={disableDelete}
          >
            Delete User
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
