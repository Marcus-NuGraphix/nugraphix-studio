import { Inbox } from 'lucide-react'
import { EmptyState } from '@/components/empties/empty-state'

export function ContactAdminPlaceholder() {
  return (
    <EmptyState
      icon={Inbox}
      title="Contact CRM UI scaffolding pending"
      description="Connect contact list, detail, and status workflow components in the next admin implementation cycle."
    />
  )
}
