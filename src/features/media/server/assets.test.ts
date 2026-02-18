import { describe, expect, it } from 'vitest'
import { mediaAssetMetadataSchema } from '@/features/media/schemas/asset'
import {
  mediaImageUploadSchema,
  mediaPdfUploadSchema,
} from '@/features/media/schemas/upload'

describe('media asset schemas', () => {
  it('accepts valid metadata payload', () => {
    const parsed = mediaAssetMetadataSchema.safeParse({
      id: 'asset-1',
      type: 'image',
      altText: 'Primary hero image',
    })

    expect(parsed.success).toBe(true)
  })

  it('normalizes empty alt text to undefined', () => {
    const parsed = mediaAssetMetadataSchema.parse({
      id: 'asset-1',
      type: 'document',
      altText: '',
    })

    expect(parsed.altText).toBeUndefined()
  })

  it('validates image upload content type', () => {
    const parsed = mediaImageUploadSchema.safeParse({
      fileName: 'hero.png',
      contentType: 'image/png',
      dataUrl: 'data:image/png;base64,Zm9v',
    })

    expect(parsed.success).toBe(true)
  })

  it('rejects non-pdf content for document uploads', () => {
    const parsed = mediaPdfUploadSchema.safeParse({
      fileName: 'report.png',
      contentType: 'image/png',
      dataUrl: 'data:image/png;base64,Zm9v',
    })

    expect(parsed.success).toBe(false)
  })
})
