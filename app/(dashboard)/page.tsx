import { requireAuth } from '@/lib/auth'
import { iamClient } from '@/lib/iam-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ShieldCheck, AppWindow, HeartPulse } from 'lucide-react'

export default async function DashboardPage() {
  const session = await requireAuth()
  if (!session) return null

  let users = []
  let roles = []
  let health = null

  try { users = await iamClient.getUsers(session.token) } catch {}
  try { roles = await iamClient.getRoles(session.token) } catch {}
  try { health = await iamClient.health() } catch {}

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-400' },
    { label: 'Roles', value: roles.length, icon: ShieldCheck, color: 'text-teal-400' },
    { label: 'Applications', value: 2, icon: AppWindow, color: 'text-amber-400' },
    { label: 'IAM Status', value: health ? 'Online' : 'Offline', icon: HeartPulse, color: health ? 'text-emerald-400' : 'text-rose-400' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, {session.user.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.slice(0, 5).map((u: { id: string; email: string; isActive: boolean; roles: string[] }) => (
                <div key={u.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {u.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{u.email}</div>
                      <div className="text-xs text-muted-foreground">{u.roles?.[0] ?? 'User'}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
              {users.length === 0 && <p className="text-sm text-muted-foreground">No users found</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'CONTRACT_MON', desc: 'Contract Monitoring System', status: 'Online' },
              { name: 'RIG_MON', desc: 'Rig Monitoring System', status: 'Online' },
            ].map(app => (
              <div key={app.name} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-mono font-semibold">{app.name}</div>
                  <div className="text-xs text-muted-foreground">{app.desc}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                  {app.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
