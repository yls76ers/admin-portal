import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { iamClient } from '@/lib/iam-client'
import { Button } from '@/components/ui/button'
import { Shield, Plus, Lock } from 'lucide-react'

interface Permission {
  id: string
  code: string
  name: string
  resource: string
  action: string
}

interface Role {
  id: string
  code: string
  name: string
  description: string | null
  isSystemRole: boolean
  applicationCode: string
  applicationName: string
  permissions: Permission[]
}

export default async function RolesPage() {
  const session = await requireAuth()
  if (!session) redirect('/login')

  let roles: Role[] = []
  try { roles = await iamClient.getRoles(session.token) } catch {}

  const grouped = roles.reduce((acc, role) => {
    if (!acc[role.applicationCode]) acc[role.applicationCode] = { name: role.applicationName, roles: [] }
    acc[role.applicationCode].roles.push(role)
    return acc
  }, {} as Record<string, { name: string; roles: Role[] }>)

  const actionColors: Record<string, string> = {
    read:    'bg-blue-500/10 text-blue-600',
    write:   'bg-amber-500/10 text-amber-600',
    approve: 'bg-purple-500/10 text-purple-600',
    manage:  'bg-rose-500/10 text-rose-600',
    delete:  'bg-red-500/10 text-red-600',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground text-sm mt-1">{roles.length} roles across {Object.keys(grouped).length} applications</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Role
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{roles.length}</div>
            <div className="text-xs text-muted-foreground">Total Roles</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{roles.filter(r => r.isSystemRole).length}</div>
            <div className="text-xs text-muted-foreground">System Roles</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{[...new Set(roles.flatMap(r => r.permissions.map(p => p.code)))].length}</div>
            <div className="text-xs text-muted-foreground">Unique Permissions</div>
          </div>
        </div>
      </div>

      {/* Roles per Application */}
      {Object.entries(grouped).map(([appCode, { name: appName, roles: appRoles }]) => (
        <div key={appCode} className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full font-mono">{appCode}</span>
            <h2 className="text-sm font-semibold">{appName}</h2>
            <span className="ml-auto text-xs text-muted-foreground">{appRoles.length} roles</span>
          </div>
          <div className="divide-y divide-border">
            {appRoles.map(role => (
              <div key={role.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold">{role.name}</span>
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{role.code}</span>
                      {role.isSystemRole && (
                        <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-semibold">System</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {role.permissions.map(p => (
                        <span key={p.id} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${actionColors[p.action] ?? 'bg-muted text-muted-foreground'}`}>
                          {p.name}
                        </span>
                      ))}
                      {role.permissions.length === 0 && (
                        <span className="text-xs text-muted-foreground">No permissions</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="text-xs h-7">Edit</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {roles.length === 0 && (
        <div className="bg-card border border-border rounded-xl px-6 py-12 text-center text-muted-foreground text-sm">
          No roles found
        </div>
      )}
    </div>
  )
}
