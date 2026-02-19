import { FileText } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function DocumentPreviewSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-border p-4" aria-hidden="true">
      <div className="flex items-center gap-2">
        <FileText className="text-muted-foreground size-4" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-[360px] w-full rounded-md" />
    </div>
  )
}
