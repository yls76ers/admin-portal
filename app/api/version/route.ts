import { NextResponse } from 'next/server'
import { getVersionId } from '@/lib/version'

export async function GET() {
  return NextResponse.json({ version: getVersionId() })
}
