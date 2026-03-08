import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { iamClient } from '@/lib/iam-client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Plus, Shield, CheckCircle, XCircle } from 'lucide-react'

interface UserRole {
  applicationCode: string
  applicationName: string
  roleCode: string
  roleName: string
  grantedAt: string
  expiresAt: string | null
}

interface IamUserDetail {
  id: string
  email: string
  displayName: string
  isActive: boolean
  isEmailVerified: boolean
  lastLoginAt: string | null
  createdAt: string
  roles: UserRole[]
}

export default async function UsersPage() {
  const session = await requireAuth()
  if (!session) redirect('/login')

  let users: IamUserDetail[] = []
  try { users = await iamClient.getUsers(session.token) } catch {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {users.length} user{users.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-xs text-muted-foreground">Total Users</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{users.filter(u => u.isActive).length}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{users.filter(u => !u.isActive).length}</div>
            <div className="text-xs text-muted-foreground">Inactive</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold">All Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3 uppercase tracking-wider">User</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3 uppercase tracking-wider">Roles</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3 uppercase tracking-wider">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3 uppercase tracking-wider">Last Login</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3 uppercase tracking-wider">Created</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-6 py-3 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {user.displayName?.charAt(0) ?? user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{user.displayName}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((r, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                          <Shield className="w-2.5 h-2.5" />
                          {r.roleCode}
                          <span className="text-muted-foreground">·{r.applicationCode}</span>
                        </span>
                      ))}
                      {user.roles.length === 0 && <span className="text-xs text-muted-foreground">No roles</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="text-xs h-7">Edit</Button>
                      <Button variant="outline" size="sm" className="text-xs h-7 text-rose-500 hover:text-rose-600 hover:border-rose-300">
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
