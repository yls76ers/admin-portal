import { requireAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

const IAM = process.env.IAM_BASE_URL
const APP = process.env.IAM_APP_CODE

export async function GET() {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const res = await fetch(`${IAM}/api/v1/users`, {
    headers: { Authorization: `Bearer ${session.token}` }
  })
  const data = await res.json()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const res = await fetch(`${IAM}/api/v1/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
    body: JSON.stringify(body)
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
