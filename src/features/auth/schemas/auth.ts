import z from 'zod'
import { passwordPolicySchema } from '@/features/auth/schemas/password'
import { toSafeRedirectPath } from '@/features/auth/model/redirect'

export const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.email('Enter a valid email address.'),
  password: passwordPolicySchema,
})

export const authEntrySearchSchema = z
  .object({
    redirect: z
      .string()
      .optional()
      .transform((value) => {
        if (!value) {
          return undefined
        }

        const safePath = toSafeRedirectPath(value, '')
        return safePath || undefined
      }),
  })

export const forgotPasswordSchema = z.object({
  email: z.email('Enter a valid email address.'),
})

export const resetPasswordSchema = z
  .object({
    password: passwordPolicySchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

export const resetPasswordSearchSchema = z.object({
  token: z.string().min(1, 'Reset token is required.'),
  callbackURL: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return undefined
      }

      const safePath = toSafeRedirectPath(value, '')
      return safePath || undefined
    }),
})
