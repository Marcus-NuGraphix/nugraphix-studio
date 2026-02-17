import type { UserRole } from '@/features/auth/model/session'
import { auth } from '@/features/auth/server/auth'
import { AppError } from '@/lib/errors'

interface CreateAdminUserInput {
  headers: Headers
  email: string
  password: string
  name: string
  role: UserRole
}

interface CreateAdminUserResult {
  user: {
    id: string
    email: string
    name: string
    role?: string | Array<string>
  }
}

type CreateUserEndpoint = (input: {
  body: {
    email: string
    password: string
    name: string
    role: UserRole
  }
  headers: Headers
}) => Promise<CreateAdminUserResult>

const resolveCreateUserEndpoint = (): CreateUserEndpoint => {
  const endpoint = (auth.api as { createUser?: unknown }).createUser

  if (typeof endpoint !== 'function') {
    throw new AppError(
      'INTERNAL',
      'Better Auth admin create-user endpoint is not available.',
    )
  }

  return endpoint as CreateUserEndpoint
}

const toCreateUserError = (error: unknown) => {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (
      message.includes('already exists') ||
      message.includes('already registered') ||
      message.includes('already in use')
    ) {
      return new AppError(
        'CONFLICT',
        'An account with this email already exists.',
        { cause: error },
      )
    }

    if (message.includes('unauthorized') || message.includes('forbidden')) {
      return new AppError(
        'FORBIDDEN',
        'You are not authorized to create users.',
        { cause: error },
      )
    }
  }

  return new AppError('INTERNAL', 'Unable to create user right now.', {
    cause: error,
  })
}

export const createAdminUser = async ({
  headers,
  email,
  password,
  name,
  role,
}: CreateAdminUserInput): Promise<CreateAdminUserResult> => {
  const createUser = resolveCreateUserEndpoint()

  try {
    return await createUser({
      body: {
        email,
        password,
        name,
        role,
      },
      headers,
    })
  } catch (error) {
    throw toCreateUserError(error)
  }
}
