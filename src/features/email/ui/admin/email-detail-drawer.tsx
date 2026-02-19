import { AlertTriangle, MailCheck, RotateCcw } from 'lucide-react'
import type { EmailMessageStatus } from '@/features/email/model/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface EmailDetailDrawerData {
  message: {
    id: string
    toEmail: string
    toUserId: string | null
    provider: string
    templateKey: string
    messageType: string
    topic: string | null
    status: EmailMessageStatus
    subject: string
    errorMessage: string | null
    attempts: number
    createdAt: Date
    updatedAt: Date
    sentAt: Date | null
  }
  events: Array<{
    id: string
    type: string
    providerEventId: string | null
    email: string | null
    occurredAt: Date | null
    createdAt: Date
  }>
}

interface EmailDetailDrawerProps {
  open: boolean
  detail: EmailDetailDrawerData | null
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onRetry: (id: string) => void
}

export function EmailDetailDrawer({
  open,
  detail,
  isLoading,
  onOpenChange,
  onRetry,
}: EmailDetailDrawerProps) {
  const message = detail?.message ?? null
  const events = detail?.events ?? []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-xl overflow-y-auto bg-secondary p-0 text-secondary-foreground sm:max-w-xl">
        <SheetHeader className="space-y-2 border-b border-border px-5 py-4">
          <SheetTitle className="text-foreground">
            {message ? 'Message Detail' : 'Email Detail'}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Delivery timeline, provider event trace, and retry controls.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-5 py-4">
          {isLoading ? (
            <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Loading email detail...
            </div>
          ) : !message ? (
            <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Select an email row to inspect its delivery trace.
            </div>
          ) : (
            <>
              <section className="space-y-3 rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {message.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Recipient: {message.toEmail}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Template: {message.templateKey}
                    </p>
                  </div>
                  <StatusBadge status={message.status} />
                </div>

                <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                  <p>Provider: {message.provider}</p>
                  <p>Attempts: {message.attempts}</p>
                  <p>Queued: {message.createdAt.toLocaleString()}</p>
                  <p>Updated: {message.updatedAt.toLocaleString()}</p>
                  <p>
                    Sent:{' '}
                    {message.sentAt ? message.sentAt.toLocaleString() : '—'}
                  </p>
                  <p>Topic: {message.topic ?? 'none'}</p>
                </div>

                {message.errorMessage ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    <p className="font-semibold">Last error</p>
                    <p>{message.errorMessage}</p>
                  </div>
                ) : null}

                {message.status === 'failed' ? (
                  <div className="flex justify-end">
                    <Button onClick={() => onRetry(message.id)}>
                      <RotateCcw className="size-4" />
                      Retry Message
                    </Button>
                  </div>
                ) : null}
              </section>

              <section className="space-y-2 rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">
                  Delivery Timeline
                </p>
                {events.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No provider or lifecycle events recorded yet.
                  </p>
                ) : (
                  events.map((event) => (
                    <article
                      key={event.id}
                      className="rounded-lg border border-border bg-secondary p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {event.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.occurredAt
                            ? event.occurredAt.toLocaleString()
                            : 'Unknown time'}
                        </p>
                      </div>
                      {event.providerEventId ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Provider Event: {event.providerEventId}
                        </p>
                      ) : null}
                      <p className="mt-1 text-xs text-muted-foreground">
                        Logged: {event.createdAt.toLocaleString()}
                      </p>
                    </article>
                  ))
                )}
              </section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function StatusBadge({ status }: { status: EmailMessageStatus }) {
  if (status === 'failed' || status === 'bounced' || status === 'complained') {
    return (
      <Badge className="border border-destructive/30 bg-destructive/10 text-destructive">
        <AlertTriangle className="size-3.5" />
        {status}
      </Badge>
    )
  }

  if (status === 'delivered' || status === 'opened' || status === 'clicked') {
    return (
      <Badge className="border border-accent/30 bg-accent/10 text-accent">
        <MailCheck className="size-3.5" />
        {status}
      </Badge>
    )
  }

  if (status === 'queued' || status === 'sent') {
    return (
      <Badge className="border border-border bg-secondary text-muted-foreground">
        {status}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="text-muted-foreground">
      {status}
    </Badge>
  )
}
