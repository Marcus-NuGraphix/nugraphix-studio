const auditActionLabels: Record<string, string> = {
  'user-created': 'User Created',
  'profile-updated': 'Profile Updated',
  'password-changed': 'Password Changed',
  'role-updated': 'Role Updated',
  'status-suspended': 'Account Suspended',
  'status-reactivated': 'Account Reactivated',
  'sessions-revoked': 'Sessions Revoked',
  'session-revoked': 'Session Revoked',
  'account-deleted': 'Account Deleted',
}

const securityEventLabels: Record<string, string> = {
  'password-changed': 'Password Changed',
  'session-revoked': 'Session Revoked',
  'sessions-revoked': 'All Sessions Revoked',
  'failed-login': 'Failed Login',
  'mfa-challenge': 'MFA Challenge',
}

const toTitleCaseFallback = (value: string) =>
  value
    .split(/[-_]/g)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(' ')

export const toAuditActionLabel = (value: string) =>
  auditActionLabels[value] ?? toTitleCaseFallback(value)

export const toSecurityEventLabel = (value: string) =>
  securityEventLabels[value] ?? toTitleCaseFallback(value)
