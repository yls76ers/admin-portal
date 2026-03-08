import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ScrollText, LogIn, LogOut, UserPlus, Shield, Settings, Trash2 } from 'lucide-react'

const mockLogs = [
  { id: 1, action: 'LOGIN', actor: 'admin@iam.local', target: 'AUTH', detail: 'Successful login from CONTRACT_MON', timestamp: '2026-03-08T10:54:14Z', status: 'success' },
  { id: 2, action: 'LOGIN', actor: 'admin@iam.local', target: 'AUTH', detail: 'Successful login from CONTRACT_MON', timestamp: '2026-03-08T09:30:00Z', status: 'success' },
  { id: 3, action: 'TOKEN_REFRESH', actor: 'admin@iam.local', target: 'AUTH', detail: 'Access token refreshed', timestamp: '2026-03-08T09:45:00Z', status: 'success' },
  { id: 4, action: 'LOGIN_FAILED', actor: 'unknown@test.com', target: 'AUTH', detail: 'Invalid credentials', timestamp: '2026-03-08T08:12:00Z', status: 'failed' },
  { id: 5, action: 'USER_CREATED', actor: 'admin@iam.local', target: 'USERS', detail: 'New user created', timestamp: '2026-03-07T14:00:00Z', status: 'success' },
  { id: 6, action: 'ROLE_ASSIGNED', actor: 'admin@iam.local', target: 'ROLES', detail: 'Role SYS_ADMIN assigned to user', timestamp: '2026-03-07T14:01:00Z', status: 'success' },
  { id: 7, action: 'LOGOUT', actor: 'admin@iam.local', target: 'AUTH', detail: 'User logged out', timestamp: '2026-03-07T17:00:00Z', status: 'success' },
  { id: 8, action: 'TOKEN_REVOKED', actor: 'admin@iam.local', target: 'AUTH', detail: 'Refresh token revoked', timestamp: '2026-03-07T17:00:01Z', status: 'success' },
]

const actionConfig: Record<string, { icon: any; color: string; bg: string }> = {
  LOGIN:         { icon: LogIn,    color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  LOGOUT:        { icon: LogOut,   color: 'text-gray-500',    bg: 'bg-gray-500/10' },
  LOGIN_FAILED:  { icon: LogIn,    color: 'text-rose-500',    bg: 'bg-rose-500/10' },
  USER_CREATED:  { icon: UserPlus, color: 'text-blue-600',    bg: 'bg-blue-500/10' },
  ROLE_ASSIGNED: { icon: Shield,   color: 'text-purple-600',  bg: 'bg-purple-500/10' },
  TOKEN_REFRESH: { icon: Settings, color: 'text-amber-600',   bg: 'bg-amber-500/10' },
  TOKEN_REVOKED: { icon: Trash2,   color: 'text-rose-500',    bg: 'bg-rose-500/10' },
}

export default async function AuditPage() {
  const session = await requireAuth()
  if (!session) redirect('/login')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
          <p className="text-muted-foreground text-sm mt-1">Activity history across all services</p>
        </div>
        <span className="text-xs bg-amber-500/10 text-amber-600 font-semibold px-3 py-1.5 rounded-full">
          Mock Data — IAM audit endpoint not yet available
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: mockLogs.length, color: 'text-foreground' },
          { label: 'Successful', value: mockLogs.filter(l => l.status === 'success').length, color: 'text-emerald-600' },
          { label: 'Failed', value: mockLogs.filter(l => l.status === 'failed').length, color: 'text-rose-500' },
          { label: 'Today', value: mockLogs.filter(l => l.timestamp.startsWith('2026-03-08')).length, color: 'text-primary' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Log Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border">
          {mockLogs.map(log => {
            const cfg = actionConfig[log.action] ?? { icon: ScrollText, color: 'text-muted-foreground', bg: 'bg-muted' }
            const Icon = cfg.icon
            return (
              <div key={log.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono">{log.action}</span>
                    <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{log.target}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">{log.detail}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-medium">{log.actor}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Date(log.timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  log.status === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {log.status}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
