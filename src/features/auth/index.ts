// Client
export { authClient } from '@/features/auth/client/auth-client'

// Model
export type { AppSession, UserRole } from '@/features/auth/model/session'
export { roleValues } from '@/features/auth/model/session'
export { hasPermission } from '@/features/auth/model/permissions'
export {
  getRoleLandingPath,
  resolvePostAuthRedirect,
  toUserRole,
} from '@/features/auth/model/post-auth'
export { toSafeAuthErrorMessage } from '@/features/auth/model/safe-errors'
export { toSafeRedirectPath } from '@/features/auth/model/redirect'

// Schemas
export {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  authEntrySearchSchema,
  resetPasswordSearchSchema,
} from '@/features/auth/schemas/auth'
export { passwordPolicySchema } from '@/features/auth/schemas/password'

// Server
export { auth } from '@/features/auth/server/auth'
export { getSessionFn, getOptionalSessionFn, getAdminSessionFn } from '@/features/auth/server/session'
export { assertPermission } from '@/features/auth/server/authorize'

// UI
export { LoginForm } from '@/features/auth/ui/login-form'
export { SignupForm } from '@/features/auth/ui/signup-form'
export { ForgotPasswordForm } from '@/features/auth/ui/forgot-password-form'
export { ResetPasswordForm } from '@/features/auth/ui/reset-password-form'
