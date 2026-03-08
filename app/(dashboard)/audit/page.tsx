import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
export default async function AuditPage() {
  const session = await requireAuth()
  if (!session) redirect('/login')
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground text-sm mt-1">Track all system events and changes</p>
      </div>
      <div className="border border-dashed border-border rounded-xl p-12 text-center">
        <div className="text-4xl mb-4">📋</div>
        <div className="font-semibold text-lg mb-2">Audit Trail</div>
        <p className="text-muted-foreground text-sm">Login, CRUD, permission changes with filter — coming soon</p>
      </div>
    </div>
  )
}
