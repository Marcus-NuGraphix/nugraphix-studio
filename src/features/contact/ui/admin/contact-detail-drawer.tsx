import { Loader2, MessageSquareDashed, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type {
  ContactAssigneeSummary,
  ContactSubmissionDetail,
  ContactSubmissionStatus,
  ContactSubmissionSummary,
} from '@/features/contact/model/types'
import { contactSubmissionStatusValues } from '@/features/contact/model/types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import {
  preferredContactLabels,
  propertyTypeLabels,
  serviceInterestLabels,
  urgencyLabels,
} from '@/features/contact/model/lead-form'
import { ContactStatusBadge } from '@/features/contact/ui/admin/contact-status-badge'

interface ContactDetailDrawerData {
  contact: ContactSubmissionDetail | null
  assignees: Array<ContactAssigneeSummary>
}

interface ContactDetailDrawerProps {
  open: boolean
  detail: ContactDetailDrawerData | null
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (status: ContactSubmissionStatus) => Promise<void>
  onAssign: (assignedTo: string | null) => Promise<void>
  onAddNote: (note: string) => Promise<void>
}

const statusLabel: Record<ContactSubmissionStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  'closed-won': 'Closed Won',
  'closed-lost': 'Closed Lost',
}

const detailFields = (
  contact: ContactSubmissionSummary,
): Array<{ label: string; value: string }> => [
  { label: 'Email', value: contact.email },
  { label: 'Phone', value: contact.phone },
  { label: 'Suburb / Region', value: contact.suburb },
  {
    label: 'Service Interest',
    value: serviceInterestLabels[contact.serviceInterest],
  },
  {
    label: 'Organization Profile',
    value: propertyTypeLabels[contact.propertyType],
  },
  { label: 'Urgency', value: urgencyLabels[contact.urgency] },
  {
    label: 'Preferred Contact Method',
    value: preferredContactLabels[contact.preferredContactMethod],
  },
  {
    label: 'Best Contact Time',
    value: contact.bestContactTime || 'Not specified',
  },
  { label: 'Source Path', value: contact.sourcePath },
]

export function ContactDetailDrawer({
  open,
  detail,
  isLoading,
  onOpenChange,
  onStatusChange,
  onAssign,
  onAddNote,
}: ContactDetailDrawerProps) {
  const contact = detail?.contact ?? null
  const assignees = detail?.assignees ?? []
  const [note, setNote] = useState('')
  const [isStatusSaving, setIsStatusSaving] = useState(false)
  const [isAssignSaving, setIsAssignSaving] = useState(false)
  const [isNoteSaving, setIsNoteSaving] = useState(false)

  useEffect(() => {
    setNote('')
  }, [contact?.id])

  const hasExistingNotes = useMemo(
    () => Boolean(contact?.notes?.trim()),
    [contact?.notes],
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-xl overflow-y-auto bg-secondary p-0 text-secondary-foreground sm:max-w-xl">
        <SheetHeader className="space-y-2 border-b border-border px-5 py-4">
          <SheetTitle className="text-foreground">
            {contact ? 'Lead Detail' : 'Contact Detail'}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Review inquiry context, assign ownership, and log follow-up actions.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-5 py-4">
          {isLoading ? (
            <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Loading contact submission...
            </div>
          ) : !contact ? (
            <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Select a contact row to inspect details and update pipeline status.
            </div>
          ) : (
            <>
              <section className="space-y-3 rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {contact.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {contact.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submitted {new Date(contact.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <ContactStatusBadge status={contact.status} />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="contact-status">Pipeline Status</Label>
                    <Select
                      value={contact.status}
                      onValueChange={async (value) => {
                        setIsStatusSaving(true)
                        try {
                          await onStatusChange(value as ContactSubmissionStatus)
                        } finally {
                          setIsStatusSaving(false)
                        }
                      }}
                    >
                      <SelectTrigger
                        id="contact-status"
                        className="h-9 border-input bg-background"
                        disabled={isStatusSaving}
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {contactSubmissionStatusValues.map((value) => (
                          <SelectItem key={value} value={value}>
                            {statusLabel[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="contact-assignee">Assignee</Label>
                    <Select
                      value={contact.assignedTo?.id ?? 'unassigned'}
                      onValueChange={async (value) => {
                        setIsAssignSaving(true)
                        try {
                          await onAssign(value === 'unassigned' ? null : value)
                        } finally {
                          setIsAssignSaving(false)
                        }
                      }}
                    >
                      <SelectTrigger
                        id="contact-assignee"
                        className="h-9 border-input bg-background"
                        disabled={isAssignSaving}
                      >
                        <SelectValue placeholder="Assign owner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {assignees.map((assignee) => (
                          <SelectItem key={assignee.id} value={assignee.id}>
                            {assignee.name} ({assignee.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <section className="space-y-3 rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">
                  Inquiry Context
                </p>
                <div className="grid gap-3 text-xs text-muted-foreground md:grid-cols-2">
                  {detailFields(contact).map((field) => (
                    <div key={field.label} className="space-y-0.5">
                      <p className="font-medium text-foreground">{field.label}</p>
                      <p>{field.value}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 rounded-lg border border-border bg-secondary p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Message
                  </p>
                  <p className="text-sm text-foreground">{contact.message}</p>
                </div>
              </section>

              <section className="space-y-3 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <MessageSquareDashed className="size-4 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">
                    Internal Notes
                  </p>
                </div>

                {hasExistingNotes ? (
                  <div className="max-h-56 overflow-y-auto rounded-lg border border-border bg-secondary p-3">
                    <pre className="font-sans text-xs leading-6 whitespace-pre-wrap text-muted-foreground">
                      {contact.notes}
                    </pre>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No notes yet. Add follow-up actions and outcomes for team
                    visibility.
                  </p>
                )}

                <form
                  className="space-y-2"
                  onSubmit={async (event) => {
                    event.preventDefault()
                    const trimmed = note.trim()
                    if (trimmed.length < 3 || isNoteSaving) return

                    setIsNoteSaving(true)
                    try {
                      await onAddNote(trimmed)
                      setNote('')
                    } finally {
                      setIsNoteSaving(false)
                    }
                  }}
                >
                  <Textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Add follow-up notes, call outcomes, or next steps..."
                    rows={4}
                    disabled={isNoteSaving}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={note.trim().length < 3 || isNoteSaving}>
                      {isNoteSaving ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Saving note...
                        </>
                      ) : (
                        <>
                          <UserRound className="size-4" />
                          Add Note
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
