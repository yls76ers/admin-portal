import { NextRequest, NextResponse } from 'next/server'
import { iamClient } from '@/lib/iam-client'
import { AUTH_COOKIE, REFRESH_COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const data = await iamClient.login({ email, password })

    const res = NextResponse.json({ success: true, user: data.user })

    res.cookies.set(AUTH_COOKIE, data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    res.cookies.set(REFRESH_COOKIE, data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return res
  } catch (err: unknown) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Login failed' },
      { status: 401 }
    )
  }
}
