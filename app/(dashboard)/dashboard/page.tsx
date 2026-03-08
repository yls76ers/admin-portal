import { requireAuth } from '@/lib/auth'
import { iamClient } from '@/lib/iam-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ShieldCheck, AppWindow, HeartPulse } from 'lucide-react'

export default async function DashboardPage() {
  const session = await requireAuth()
  if (!session) return null

  let users: any[] = []
  let roles: any[] = []
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
    </div>
  )
}
