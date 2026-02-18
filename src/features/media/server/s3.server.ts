import { randomUUID } from 'node:crypto'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { env } from '@/lib/env/server'

type UploadPublicObjectInput = {
  body: Buffer
  contentDisposition?: string
  contentType: string
  fileName: string
  keyPrefix: string
}

type UploadPublicObjectResult = {
  key: string
  url: string
}

const sanitizeSegment = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)

const resolveFileExtension = (fileName: string) => {
  const extensionIndex = fileName.lastIndexOf('.')
  if (extensionIndex <= 0 || extensionIndex === fileName.length - 1) {
    return ''
  }

  return sanitizeSegment(fileName.slice(extensionIndex + 1))
}

const createS3Client = () =>
  new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: env.S3_FORCE_PATH_STYLE,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
  })

let cachedClient: S3Client | undefined

const getS3Client = () => {
  cachedClient ??= createS3Client()
  return cachedClient
}

const resolvePublicUrl = (key: string) => {
  if (env.S3_PUBLIC_BASE_URL) {
    return `${env.S3_PUBLIC_BASE_URL.replace(/\/+$/, '')}/${key}`
  }

  return `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com/${key}`
}

export const uploadPublicObject = async (
  input: UploadPublicObjectInput,
): Promise<UploadPublicObjectResult> => {
  const client = getS3Client()
  const extension = resolveFileExtension(input.fileName)
  const dateSegment = new Date().toISOString().slice(0, 10)
  const uniqueFileName = `${randomUUID()}${extension ? `.${extension}` : ''}`
  const key = `${sanitizeSegment(input.keyPrefix)}/${dateSegment}/${uniqueFileName}`

  await client.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: input.body,
      ContentType: input.contentType,
      ContentDisposition: input.contentDisposition,
      CacheControl: input.contentType.startsWith('image/')
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=86400',
    }),
  )

  return {
    key,
    url: resolvePublicUrl(key),
  }
}

export const deletePublicObject = async (key: string) => {
  const client = getS3Client()

  await client.send(
    new DeleteObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
    }),
  )
}
