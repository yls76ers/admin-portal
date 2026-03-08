import { requireAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

const IAM = process.env.IAM_BASE_URL

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const res = await fetch(`${IAM}/api/v1/roles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
    body: JSON.stringify(body)
  })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const res = await fetch(`${IAM}/api/v1/roles/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${session.token}` }
  })
  if (res.status === 204) return NextResponse.json({ success: true })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}
