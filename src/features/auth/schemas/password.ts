import z from 'zod'

export const passwordPolicySchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .max(128, 'Password must be at most 128 characters')
  .refine((value) => /[A-Z]/.test(value), {
    message: 'Password must include at least one uppercase letter',
  })
  .refine((value) => /[a-z]/.test(value), {
    message: 'Password must include at least one lowercase letter',
  })
  .refine((value) => /[0-9]/.test(value), {
    message: 'Password must include at least one number',
  })
