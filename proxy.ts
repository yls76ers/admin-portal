import { NextRequest, NextResponse } from 'next/server'
import { decodeJwt } from 'jose'

const PUBLIC_PATHS = ['/login', '/api/auth']
const IAM = process.env.IAM_BASE_URL
const APP_CODE = process.env.IAM_APP_CODE

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const token = req.cookies.get('admin_token')?.value
  const refreshToken = req.cookies.get('admin_refresh')?.value

  // No token at all → redirect login
  if (!token && !refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Check if access token is still valid
  if (token) {
    try {
      const payload = decodeJwt(token)
      const exp = payload.exp as number
      const isExpired = Date.now() / 1000 > exp
      if (!isExpired) return NextResponse.next()
    } catch {
      // invalid token, fall through to refresh
    }
  }

  // Access token expired or missing — try refresh
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const res = await fetch(`${IAM}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken, applicationCode: APP_CODE }),
    })

    if (!res.ok) {
      const response = NextResponse.redirect(new URL('/login', req.url))
      response.cookies.delete('admin_token')
      response.cookies.delete('admin_refresh')
      return response
    }

    const data = await res.json()
    const newToken = data?.data?.accessToken
    const newRefresh = data?.data?.refreshToken

    if (!newToken) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Continue request with new token set in cookies
    const response = NextResponse.next()
    response.cookies.set('admin_token', newToken, { httpOnly: true, sameSite: 'lax', path: '/' })
    if (newRefresh) {
      response.cookies.set('admin_refresh', newRefresh, { httpOnly: true, sameSite: 'lax', path: '/' })
    }
    return response
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
