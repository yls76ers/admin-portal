import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CheckCircle, XCircle, Clock, Activity } from 'lucide-react'

interface HealthResult {
  name: string
  url: string
  status: 'healthy' | 'unhealthy' | 'unknown'
  responseMs?: number
  timestamp?: string
  error?: string
}

async function checkHealth(name: string, url: string): Promise<HealthResult> {
  const start = Date.now()
  try {
    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(5000) })
    const ms = Date.now() - start
    if (res.ok) {
      const data = await res.json().catch(() => ({}))
      return { name, url, status: 'healthy', responseMs: ms, timestamp: data.timestamp }
    }
    return { name, url, status: 'unhealthy', responseMs: Date.now() - start, error: `HTTP ${res.status}` }
  } catch (e: any) {
    return { name, url, status: 'unhealthy', responseMs: Date.now() - start, error: e.message ?? 'Timeout' }
  }
}

export default async function HealthPage() {
  const session = await requireAuth()
  if (!session) redirect('/login')

  const IAM_URL = process.env.IAM_BASE_URL ?? ''

  const results = await Promise.all([
    checkHealth('IAM Service', `${IAM_URL}/health`),
    checkHealth('Contract Monitoring', process.env.CONTRACT_MON_URL ?? 'http://localhost:5000/health'),
    checkHealth('Rig Monitoring', process.env.RIG_MON_URL ?? 'http://localhost:5001/health'),
  ])

  const healthy = results.filter(r => r.status === 'healthy').length
  const unhealthy = results.filter(r => r.status === 'unhealthy').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Health Monitor</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time service health status — checked at {new Date().toLocaleTimeString('id-ID')}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">{healthy}</div>
            <div className="text-xs text-muted-foreground">Healthy</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-500">{unhealthy}</div>
            <div className="text-xs text-muted-foreground">Unhealthy</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{results.length}</div>
            <div className="text-xs text-muted-foreground">Total Services</div>
          </div>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 gap-4">
        {results.map(svc => (
          <div key={svc.name} className="bg-card border border-border rounded-xl p-5 flex items-center gap-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              svc.status === 'healthy' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
            }`}>
              {svc.status === 'healthy'
                ? <CheckCircle className="w-5 h-5 text-emerald-600" />
                : <XCircle className="w-5 h-5 text-rose-500" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{svc.name}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  svc.status === 'healthy'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {svc.status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 font-mono">{svc.url}</div>
              {svc.error && <div className="text-xs text-rose-500 mt-1">{svc.error}</div>}
            </div>
            <div className="text-right shrink-0">
              {svc.responseMs !== undefined && (
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className={svc.responseMs > 500 ? 'text-amber-500' : 'text-emerald-600'}>
                    {svc.responseMs}ms
                  </span>
                </div>
              )}
              {svc.timestamp && (
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(svc.timestamp).toLocaleTimeString('id-ID')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
