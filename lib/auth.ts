import { cookies } from 'next/headers'
import { decodeJwt } from 'jose'
import { IamUser } from './iam-client'

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
    const payload = decodeJwt(token)
    const exp = payload.exp as number
    if (exp && Date.now() / 1000 > exp) return null
    const user: IamUser = {
      id: payload.sub as string,
      email: payload.email as string,
      displayName: payload.name as string,
      applicationCode: payload.app as string,
      roles: [payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string],
      permissions: (payload.permission as string[]) ?? [],
    }
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
