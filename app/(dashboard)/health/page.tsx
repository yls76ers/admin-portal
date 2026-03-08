import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { iamClient } from '@/lib/iam-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
export default async function HealthPage() {
  const session = await requireAuth()
  if (!session) redirect('/login')
  let health = null
  try { health = await iamClient.health() } catch {}
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Health Monitor</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time service status</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { name: 'IAM Service', status: health?.status === 'healthy' ? 'Online' : 'Offline', ok: !!health },
          { name: 'CONTRACT_MON', status: 'Unknown', ok: false },
          { name: 'RIG_MON', status: 'Unknown', ok: false },
        ].map(svc => (
          <Card key={svc.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{svc.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className={`text-sm font-bold px-2 py-1 rounded-full ${svc.ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {svc.status}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
