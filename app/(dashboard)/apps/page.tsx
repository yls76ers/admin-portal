import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { iamClient } from '@/lib/iam-client'
import { AppWindow, Shield, Lock } from 'lucide-react'

export default async function AppsPage() {
  const session = await requireAuth()
  if (!session) redirect('/login')

  let roles: any[] = []
  let users: any[] = []
  try { roles = await iamClient.getRoles(session.token) } catch {}
  try { users = await iamClient.getUsers(session.token) } catch {}

  const appsMap = roles.reduce((acc, role) => {
    const key = role.applicationCode
    if (!acc[key]) acc[key] = {
      code: key,
      name: role.applicationName,
      roles: [],
      permissions: new Set<string>(),
    }
    acc[key].roles.push(role)
    role.permissions.forEach((p: any) => acc[key].permissions.add(p.code))
    return acc
  }, {} as Record<string, any>)

  const apps = Object.values(appsMap)

  const appIcons: Record<string, string> = {
    CONTRACT_MON: '📋',
    RIG_MON: '🛢️',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground text-sm mt-1">{apps.length} registered applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {apps.map((app: any) => {
          const appUsers = users.filter(u =>
            u.roles?.some((r: any) => r.applicationCode === app.code)
          )
          return (
            <div key={app.code} className="bg-card border border-border rounded-xl overflow-hidden">
              {/* App Header */}
              <div className="px-6 py-5 border-b border-border flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                  {appIcons[app.code] ?? '🔧'}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-base">{app.name}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">{app.code}</div>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-600 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 divide-x divide-border">
                <div className="px-4 py-3 text-center">
                  <div className="text-xl font-bold">{app.roles.length}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Roles</div>
                </div>
                <div className="px-4 py-3 text-center">
                  <div className="text-xl font-bold">{app.permissions.size}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Permissions</div>
                </div>
                <div className="px-4 py-3 text-center">
                  <div className="text-xl font-bold">{appUsers.length}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Users</div>
                </div>
              </div>

              {/* Roles list */}
              <div className="px-6 py-4 border-t border-border">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Roles</div>
                <div className="flex flex-wrap gap-1.5">
                  {app.roles.map((r: any) => (
                    <span key={r.id} className="inline-flex items-center gap-1 text-xs bg-muted text-foreground px-2.5 py-1 rounded-full font-medium">
                      <Shield className="w-3 h-3 text-primary" />
                      {r.name}
                      {r.isSystemRole && <Lock className="w-2.5 h-2.5 text-amber-500" />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
