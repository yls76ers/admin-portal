import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
export default async function AppsPage() {
  const session = await requireAuth()
  if (!session) redirect('/login')
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage registered applications</p>
      </div>
      <div className="border border-dashed border-border rounded-xl p-12 text-center">
        <div className="text-4xl mb-4">📱</div>
        <div className="font-semibold text-lg mb-2">App Registry</div>
        <p className="text-muted-foreground text-sm">CONTRACT_MON, RIG_MON configuration — coming soon</p>
      </div>
    </div>
  )
}
