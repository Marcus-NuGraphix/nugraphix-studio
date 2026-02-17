import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '@/lib/db/client'

const secret = process.env.BETTER_AUTH_SECRET
const baseURL = process.env.BETTER_AUTH_URL

if (!secret) throw new Error('BETTER_AUTH_SECRET is not defined')
if (!baseURL) throw new Error('BETTER_AUTH_URL is not defined')

export const auth = betterAuth({
  baseURL,
  secret,

  database: drizzleAdapter(db, {
    provider: 'pg',
  }),

  emailAndPassword: {
    enabled: true,
  },

  // IMPORTANT: Better Auth docs recommend tanstackStartCookies() as the LAST plugin
  plugins: [tanstackStartCookies()],
})
