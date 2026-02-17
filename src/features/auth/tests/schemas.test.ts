import { describe, expect, it } from 'vitest'
import { passwordPolicySchema } from '@/features/auth/schemas/password'
import {
  authEntrySearchSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  resetPasswordSearchSchema,
  signupSchema,
} from '@/features/auth/schemas/auth'

describe('passwordPolicySchema', () => {
  const validPassword = 'SecurePass1'

  it('accepts a valid password', () => {
    const result = passwordPolicySchema.safeParse(validPassword)
    expect(result.success).toBe(true)
  })

  it('rejects passwords shorter than 10 characters', () => {
    const result = passwordPolicySchema.safeParse('Short1A')
    expect(result.success).toBe(false)
  })

  it('rejects passwords longer than 128 characters', () => {
    const result = passwordPolicySchema.safeParse('A1' + 'a'.repeat(127))
    expect(result.success).toBe(false)
  })

  it('rejects passwords without uppercase letters', () => {
    const result = passwordPolicySchema.safeParse('lowercase123')
    expect(result.success).toBe(false)
  })

  it('rejects passwords without lowercase letters', () => {
    const result = passwordPolicySchema.safeParse('UPPERCASE123')
    expect(result.success).toBe(false)
  })

  it('rejects passwords without numbers', () => {
    const result = passwordPolicySchema.safeParse('NoNumbersHere')
    expect(result.success).toBe(false)
  })

  it('accepts exactly 10-character valid password', () => {
    const result = passwordPolicySchema.safeParse('Abcdefghi1')
    expect(result.success).toBe(true)
  })

  it('accepts exactly 128-character valid password', () => {
    const password = 'Aa1' + 'x'.repeat(125)
    const result = passwordPolicySchema.safeParse(password)
    expect(result.success).toBe(true)
  })
})

describe('loginSchema', () => {
  it('accepts valid login credentials', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects password shorter than 8 characters', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'short',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })
})

describe('signupSchema', () => {
  it('accepts valid signup data', () => {
    const result = signupSchema.safeParse({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'SecurePass1',
    })
    expect(result.success).toBe(true)
  })

  it('rejects name shorter than 2 characters', () => {
    const result = signupSchema.safeParse({
      fullName: 'J',
      email: 'jane@example.com',
      password: 'SecurePass1',
    })
    expect(result.success).toBe(false)
  })

  it('enforces password policy on signup', () => {
    const result = signupSchema.safeParse({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'weak',
    })
    expect(result.success).toBe(false)
  })
})

describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'user@example.com',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'bad' })
    expect(result.success).toBe(false)
  })
})

describe('resetPasswordSchema', () => {
  it('accepts matching passwords that meet policy', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'NewSecure1!',
      confirmPassword: 'NewSecure1!',
    })
    expect(result.success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'NewSecure1!',
      confirmPassword: 'Different1!',
    })
    expect(result.success).toBe(false)
  })

  it('rejects weak password even when matching', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'weak',
      confirmPassword: 'weak',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty confirmPassword', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'NewSecure1!',
      confirmPassword: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('authEntrySearchSchema', () => {
  it('transforms safe redirect paths', () => {
    const result = authEntrySearchSchema.parse({
      redirect: '/dashboard',
    })
    expect(result.redirect).toBe('/dashboard')
  })

  it('strips unsafe redirect URLs', () => {
    const result = authEntrySearchSchema.parse({
      redirect: 'https://evil.com',
    })
    expect(result.redirect).toBeUndefined()
  })

  it('handles missing redirect gracefully', () => {
    const result = authEntrySearchSchema.parse({})
    expect(result.redirect).toBeUndefined()
  })

  it('strips protocol-relative redirects', () => {
    const result = authEntrySearchSchema.parse({
      redirect: '//evil.com/phish',
    })
    expect(result.redirect).toBeUndefined()
  })
})

describe('resetPasswordSearchSchema', () => {
  it('transforms safe callbackURL', () => {
    const result = resetPasswordSearchSchema.parse({
      callbackURL: '/login',
    })
    expect(result.callbackURL).toBe('/login')
  })

  it('strips unsafe callbackURL', () => {
    const result = resetPasswordSearchSchema.parse({
      callbackURL: 'https://evil.com',
    })
    expect(result.callbackURL).toBeUndefined()
  })

  it('handles missing callbackURL gracefully', () => {
    const result = resetPasswordSearchSchema.parse({})
    expect(result.callbackURL).toBeUndefined()
  })
})
