import { resolve } from 'node:path'
import { config as loadDotEnv } from 'dotenv'
import { hashPassword } from 'better-auth/crypto'
import { and, eq } from 'drizzle-orm'
import { seedBlogDemo } from './seed-blog-demo'

loadDotEnv({ path: resolve(process.cwd(), '.env.local') })
loadDotEnv({ path: resolve(process.cwd(), '.env') })

interface SeedUserDefinition {
  id: string
  email: string
  name: string
  password: string
  role: 'admin' | 'user'
}

interface SeedContentEntryDefinition {
  entryId: string
  revisionId: string
  domain: string
  slug: string
  routePath: string
  templateKey: string
  metaTitle: string
  metaDescription: string
  payload: Record<string, unknown>
}

const BASELINE_PUBLISHED_AT = new Date('2026-02-18T08:00:00.000Z')

const seedContentEntries: Array<SeedContentEntryDefinition> = [
  {
    entryId: 'seed-content-home',
    revisionId: 'seed-content-home-r1',
    domain: 'marketing',
    slug: 'home',
    routePath: '/',
    templateKey: 'public-home-v1',
    metaTitle: 'Nu Graphix Studio | Delivery Engineering and Product Systems',
    metaDescription:
      'Nu Graphix Studio builds production-ready product systems for growing teams.',
    payload: {
      sections: [
        { id: 'hero', heading: 'Build clear systems that scale.' },
        { id: 'proof', heading: 'Architecture, delivery, and operations aligned.' },
      ],
    },
  },
  {
    entryId: 'seed-content-blog',
    revisionId: 'seed-content-blog-r1',
    domain: 'marketing',
    slug: 'blog',
    routePath: '/blog',
    templateKey: 'public-blog-index-v1',
    metaTitle: 'Nu Graphix Studio Blog | Engineering and Operations',
    metaDescription:
      'Technical writing on architecture, operations, and delivery discipline.',
    payload: {
      sections: [
        { id: 'intro', heading: 'Practical engineering playbooks.' },
        { id: 'recent', heading: 'Latest production and architecture notes.' },
      ],
    },
  },
  {
    entryId: 'seed-content-portfolio',
    revisionId: 'seed-content-portfolio-r1',
    domain: 'marketing',
    slug: 'portfolio',
    routePath: '/portfolio',
    templateKey: 'public-portfolio-v1',
    metaTitle: 'Nu Graphix Studio Portfolio',
    metaDescription:
      'Selected product delivery engagements and operational outcomes.',
    payload: {
      sections: [
        { id: 'case-studies', heading: 'Delivery outcomes with measurable impact.' },
      ],
    },
  },
  {
    entryId: 'seed-content-contact',
    revisionId: 'seed-content-contact-r1',
    domain: 'marketing',
    slug: 'contact',
    routePath: '/contact',
    templateKey: 'public-contact-v1',
    metaTitle: 'Contact Nu Graphix Studio',
    metaDescription:
      'Start a scoped delivery engagement with Nu Graphix Studio.',
    payload: {
      sections: [
        { id: 'contact-form', heading: 'Tell us about your delivery objective.' },
      ],
    },
  },
]

const toSeedValue = (value: string | undefined, fallback: string) => {
  if (typeof value !== 'string') {
    return fallback
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

const resolveSeedUsers = (): Array<SeedUserDefinition> => [
  {
    id: 'seed-admin-user',
    email: toSeedValue(process.env.SEED_ADMIN_EMAIL, 'admin@demo.co.za'),
    name: toSeedValue(process.env.SEED_ADMIN_NAME, 'Demo Admin'),
    password: toSeedValue(process.env.SEED_ADMIN_PASSWORD, 'DevDemo!123'),
    role: 'admin',
  },
  {
    id: 'seed-standard-user',
    email: toSeedValue(process.env.SEED_USER_EMAIL, 'user@demo.co.za'),
    name: toSeedValue(process.env.SEED_USER_NAME, 'Demo User'),
    password: toSeedValue(process.env.SEED_USER_PASSWORD, 'DevDemo!123'),
    role: 'user',
  },
]

const importDb = async () => {
  const { db } = await import('@/lib/db')
  return db
}

type DbClient = Awaited<ReturnType<typeof importDb>>

const importSchema = async () => {
  return import('@/lib/db/schema')
}

type SchemaModule = Awaited<ReturnType<typeof importSchema>>

const resolveSeedUser = async (
  dbClient: DbClient,
  schema: SchemaModule,
  definition: SeedUserDefinition,
) => {
  const { user } = schema

  await dbClient
    .insert(user)
    .values({
      id: definition.id,
      name: definition.name,
      email: definition.email,
      emailVerified: true,
      role: definition.role,
      status: 'active',
    })
    .onConflictDoUpdate({
      target: user.email,
      set: {
        name: definition.name,
        role: definition.role,
        status: 'active',
        emailVerified: true,
        updatedAt: new Date(),
      },
    })

  const seededUser = await dbClient.query.user.findFirst({
    where: eq(user.email, definition.email),
  })

  if (!seededUser) {
    throw new Error(`Failed to resolve seeded user for ${definition.email}.`)
  }

  return seededUser
}

const upsertCredentialAccount = async (
  dbClient: DbClient,
  schema: SchemaModule,
  userId: string,
  password: string,
) => {
  const { account } = schema
  const passwordHash = await hashPassword(password)

  const existingCredentialAccount = await dbClient.query.account.findFirst({
    where: and(eq(account.userId, userId), eq(account.providerId, 'credential')),
  })

  if (existingCredentialAccount) {
    await dbClient
      .update(account)
      .set({
        accountId: userId,
        password: passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(account.id, existingCredentialAccount.id))

    return
  }

  const createdAt = new Date()
  const credentialAccountId = `credential-${userId}`

  await dbClient
    .insert(account)
    .values({
      id: credentialAccountId,
      accountId: userId,
      providerId: 'credential',
      userId,
      password: passwordHash,
      createdAt,
      updatedAt: createdAt,
    })
    .onConflictDoNothing()
}

const seedContentBaseline = async (
  dbClient: DbClient,
  schema: SchemaModule,
  actorUserId: string,
) => {
  const { contentEntry, contentPublication, contentRevision } = schema

  for (const seed of seedContentEntries) {
    await dbClient
      .insert(contentEntry)
      .values({
        id: seed.entryId,
        domain: seed.domain,
        slug: seed.slug,
        routePath: seed.routePath,
        templateKey: seed.templateKey,
        status: 'published',
        metaTitle: seed.metaTitle,
        metaDescription: seed.metaDescription,
        canonicalUrl: `https://nugraphix.co.za${seed.routePath}`,
        createdBy: actorUserId,
        updatedBy: actorUserId,
      })
      .onConflictDoUpdate({
        target: contentEntry.routePath,
        set: {
          domain: seed.domain,
          slug: seed.slug,
          templateKey: seed.templateKey,
          status: 'published',
          metaTitle: seed.metaTitle,
          metaDescription: seed.metaDescription,
          canonicalUrl: `https://nugraphix.co.za${seed.routePath}`,
          updatedBy: actorUserId,
          updatedAt: new Date(),
        },
      })

    const entryRecord = await dbClient.query.contentEntry.findFirst({
      columns: { id: true },
      where: eq(contentEntry.routePath, seed.routePath),
    })

    if (!entryRecord) {
      throw new Error(`Failed to resolve seeded content entry ${seed.routePath}.`)
    }

    await dbClient
      .insert(contentRevision)
      .values({
        id: seed.revisionId,
        entryId: entryRecord.id,
        version: 1,
        payload: seed.payload as Record<string, {}>,
        changeSummary: 'Deterministic bootstrap content baseline.',
        changedBy: actorUserId,
        createdAt: BASELINE_PUBLISHED_AT,
      })
      .onConflictDoUpdate({
        target: [contentRevision.entryId, contentRevision.version],
        set: {
          payload: seed.payload as Record<string, {}>,
          changeSummary: 'Deterministic bootstrap content baseline.',
          changedBy: actorUserId,
        },
      })

    const revisionRecord = await dbClient.query.contentRevision.findFirst({
      columns: { id: true },
      where: and(
        eq(contentRevision.entryId, entryRecord.id),
        eq(contentRevision.version, 1),
      ),
    })

    if (!revisionRecord) {
      throw new Error(
        `Failed to resolve seeded content revision for ${seed.routePath}.`,
      )
    }

    await dbClient
      .insert(contentPublication)
      .values({
        entryId: entryRecord.id,
        publishedRevisionId: revisionRecord.id,
        publishedAt: BASELINE_PUBLISHED_AT,
        scheduledAt: null,
      })
      .onConflictDoUpdate({
        target: contentPublication.entryId,
        set: {
          publishedRevisionId: revisionRecord.id,
          publishedAt: BASELINE_PUBLISHED_AT,
          scheduledAt: null,
          updatedAt: new Date(),
        },
      })
  }
}

const main = async () => {
  const dbClient = await importDb()
  const schema = await importSchema()
  const seedUsers = resolveSeedUsers()
  const seededUsers: Array<{ id: string; email: string; role: 'admin' | 'user' }> = []

  for (const seedUser of seedUsers) {
    const userRecord = await resolveSeedUser(dbClient, schema, seedUser)
    await upsertCredentialAccount(dbClient, schema, userRecord.id, seedUser.password)

    seededUsers.push({
      id: userRecord.id,
      email: userRecord.email,
      role: seedUser.role,
    })
  }

  const adminUser = seededUsers.find((user) => user.role === 'admin')

  if (!adminUser) {
    throw new Error('Admin seed user was not created.')
  }

  await seedContentBaseline(dbClient, schema, adminUser.id)
  await seedBlogDemo()

  console.log(
    `[seed-bootstrap] Upserted ${seededUsers.length} auth users, ${seedContentEntries.length} content entries, and blog demo posts.`,
  )
}

main().catch((error) => {
  console.error('[seed-bootstrap] Failed to seed deterministic bootstrap data.')
  console.error(error)
  process.exitCode = 1
})
