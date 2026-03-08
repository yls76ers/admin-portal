import { cookies } from 'next/headers'
import { iamClient, IamUser } from './iam-client'

export const AUTH_COOKIE = 'admin_token'
export const REFRESH_COOKIE = 'admin_refresh'

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value
  return { token, refreshToken }
}

export async function validateSession(): Promise<{ token: string; user: IamUser } | null> {
  const { token } = await getSession()
  if (!token) return null
  try {
    const data = await iamClient.validate(token)
    const user: IamUser = { id: data.userId, email: data.email, displayName: data.displayName, applicationCode: data.applicationCode, roles: data.roles, permissions: data.permissions }
    return { token, user }
  } catch {
    return null
  }
}

export async function requireAuth() {
  const session = await validateSession()
  if (!session) return null
  return session
}
