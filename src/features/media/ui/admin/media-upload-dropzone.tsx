import { UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import type { MediaUploadResult } from '@/features/media/model/types'
import { Button } from '@/components/ui/button'
import { readFileAsDataUrl } from '@/features/media/lib/file-upload'
import {
  uploadBlogImageFn,
  uploadPressReleasePdfFn,
} from '@/features/media/client/uploads'
import {
  imageContentTypes,
  maxDocumentBytes,
  maxImageBytes,
} from '@/features/media/schemas/upload'

interface MediaUploadDropzoneProps {
  onUploaded: (asset: MediaUploadResult) => void
}

const acceptedMimeTypes = [...imageContentTypes, 'application/pdf'] as const

const formatMbLimit = (bytes: number) => `${Math.round(bytes / 1024 / 1024)}MB`

const enforceClientSizeLimit = (file: File) => {
  if (file.type === 'application/pdf' && file.size > maxDocumentBytes) {
    throw new Error(`PDF exceeds ${formatMbLimit(maxDocumentBytes)} limit.`)
  }

  if (file.type.startsWith('image/') && file.size > maxImageBytes) {
    throw new Error(`Image exceeds ${formatMbLimit(maxImageBytes)} limit.`)
  }
}

export function MediaUploadDropzone({ onUploaded }: MediaUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const onUploadFile = async (file: File) => {
    if (!acceptedMimeTypes.includes(file.type as (typeof acceptedMimeTypes)[number])) {
      toast.error('Only images and PDF files are supported right now.')
      return
    }

    try {
      setIsUploading(true)
      enforceClientSizeLimit(file)

      const dataUrl = await readFileAsDataUrl(file)

      const result = file.type === 'application/pdf'
        ? await uploadPressReleasePdfFn({
            data: {
              fileName: file.name,
              contentType: 'application/pdf',
              dataUrl,
            },
          })
        : await uploadBlogImageFn({
            data: {
              fileName: file.name,
              contentType: file.type as (typeof imageContentTypes)[number],
              dataUrl,
            },
          })

      if (!result.ok) {
        toast.error(result.error.message)
        return
      }

      onUploaded(result.data)
      toast.success(`${file.name} uploaded to the media library.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Upload to media library</p>
          <p className="text-sm text-muted-foreground">
            Images up to {formatMbLimit(maxImageBytes)} and PDF documents up to{' '}
            {formatMbLimit(maxDocumentBytes)}.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={acceptedMimeTypes.join(',')}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.currentTarget.value = ''
            if (!file) return
            void onUploadFile(file)
          }}
        />

        <Button
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          aria-busy={isUploading}
        >
          <UploadCloud className="size-4" />
          {isUploading ? 'Uploading...' : 'Upload file'}
        </Button>
      </div>
    </div>
  )
}
