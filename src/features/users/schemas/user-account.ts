import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  image: z
    .string()
    .trim()
    .url()
    .max(500)
    .optional()
    .or(z.literal(''))
    .transform((value) => value || undefined),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(10).max(128),
    confirmPassword: z.string().min(10).max(128),
    revokeOtherSessions: z.boolean().optional().default(true),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const revokeSessionSchema = z.object({
  token: z.string().min(1),
})
