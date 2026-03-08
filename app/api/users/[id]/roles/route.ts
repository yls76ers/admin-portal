import { requireAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

const IAM = process.env.IAM_BASE_URL

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const roleData = body.roles ? body.roles[0] : body
  const res = await fetch(`${IAM}/api/v1/users/${id}/roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
    body: JSON.stringify(roleData)
  })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const roleData = body.roles ? body.roles[0] : body
  const url = `${IAM}/api/v1/users/${id}/roles?applicationCode=${encodeURIComponent(roleData.applicationCode)}&roleCode=${encodeURIComponent(roleData.roleCode)}`
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${session.token}` },
  })
  if (res.status === 204 || res.ok) return NextResponse.json({ success: true })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}
