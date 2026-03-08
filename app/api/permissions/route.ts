import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const IAM = process.env.IAM_BASE_URL

export async function GET() {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const res = await fetch(`${IAM}/api/v1/permissions`, {
    headers: { Authorization: `Bearer ${session.token}` }
  })
  const data = await res.json()
  return NextResponse.json(data)
}
