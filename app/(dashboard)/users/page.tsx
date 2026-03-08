'use client'
import { useState, useEffect, useCallback } from 'react'
import { Users, Plus, Shield, CheckCircle, XCircle, Pencil, UserX, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface UserRole { applicationCode: string; applicationName: string; roleCode: string; roleName: string }
interface IamUser { id: string; email: string; displayName: string; isActive: boolean; isEmailVerified: boolean; lastLoginAt: string | null; createdAt: string; roles: UserRole[] }

function UserModal({ user, onClose, onSaved }: { user?: IamUser; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!user
  const [form, setForm] = useState({ email: user?.email ?? '', displayName: user?.displayName ?? '', password: '', isActive: user?.isActive ?? true })
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (!form.email || !form.displayName || (!isEdit && !form.password)) {
      toast.error('Please fill all required fields')
      return
    }
    setSaving(true)
    try {
      const url = isEdit ? `/api/users/${user!.id}` : '/api/users'
      const method = isEdit ? 'PUT' : 'POST'
      const body = isEdit
        ? { displayName: form.displayName, isActive: form.isActive }
        : { email: form.email, displayName: form.displayName, password: form.password, isActive: form.isActive }
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0] ?? data?.message ?? 'Failed')
      toast.success(isEdit ? 'User updated!' : 'User created!')
      onSaved()
      onClose()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-xl">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">{isEdit ? 'Edit User' : 'Add User'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email {!isEdit && <span className="text-rose-500">*</span>}</label>
            <input
              type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              disabled={isEdit}
              className="mt-1.5 w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:bg-muted"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Display Name <span className="text-rose-500">*</span></label>
            <input
              type="text" value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
              className="mt-1.5 w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Full Name"
            />
          </div>
          {!isEdit && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password <span className="text-rose-500">*</span></label>
              <input
                type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="mt-1.5 w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Min. 8 characters"
              />
            </div>
          )}
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-primary" />
            <label htmlFor="isActive" className="text-sm">Active</label>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}</Button>
        </div>
      </div>
    </div>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState<IamUser[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; user?: IamUser }>({ open: false })

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data.data ?? [])
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  async function handleToggleActive(user: IamUser) {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: user.displayName, isActive: !user.isActive })
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(user.isActive ? 'User deactivated' : 'User activated')
      fetchUsers()
    } catch { toast.error('Failed to update user') }
  }

  return (
    <div className="space-y-6">
      {modal.open && <UserModal user={modal.user} onClose={() => setModal({ open: false })} onSaved={fetchUsers} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">{users.length} user{users.length !== 1 ? 's' : ''} registered</p>
        </div>
        <Button className="gap-2" onClick={() => setModal({ open: true })}>
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Active', value: users.filter(u => u.isActive).length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { label: 'Inactive', value: users.filter(u => !u.isActive).length, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border"><h2 className="text-sm font-semibold">All Users</h2></div>
        {loading ? (
          <div className="px-6 py-12 text-center text-muted-foreground text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {['User', 'Roles', 'Status', 'Last Login', 'Created', 'Actions'].map(h => (
                    <th key={h} className={`text-xs font-semibold text-muted-foreground px-6 py-3 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
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
                            <Shield className="w-2.5 h-2.5" />{r.roleCode}<span className="text-muted-foreground">·{r.applicationCode}</span>
                          </span>
                        ))}
                        {user.roles.length === 0 && <span className="text-xs text-muted-foreground">No roles</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive
                        ? <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Active</span>
                        : <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-muted text-muted-foreground px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>Inactive</span>
                      }
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => setModal({ open: true, user })}>
                          <Pencil className="w-3 h-3" />Edit
                        </Button>
                        <Button variant="outline" size="sm" className={`text-xs h-7 gap-1 ${user.isActive ? 'text-rose-500 hover:text-rose-600 hover:border-rose-300' : 'text-emerald-600 hover:text-emerald-700 hover:border-emerald-300'}`}
                          onClick={() => handleToggleActive(user)}>
                          {user.isActive ? <><UserX className="w-3 h-3" />Deactivate</> : <><UserCheck className="w-3 h-3" />Activate</>}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
