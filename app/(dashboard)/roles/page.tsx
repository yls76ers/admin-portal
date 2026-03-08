'use client'
import { useState, useEffect, useCallback } from 'react'
import { Shield, Plus, Lock, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Permission { id: string; code: string; name: string; resource: string; action: string }
interface Role { id: string; code: string; name: string; description: string | null; isSystemRole: boolean; applicationCode: string; applicationName: string; permissions: Permission[] }

const APPS = ['CONTRACT_MON', 'RIG_MON']
const actionColors: Record<string, string> = {
  read: 'bg-blue-500/10 text-blue-600', write: 'bg-amber-500/10 text-amber-600',
  approve: 'bg-purple-500/10 text-purple-600', manage: 'bg-rose-500/10 text-rose-600', delete: 'bg-red-500/10 text-red-600',
}

function RoleModal({ role, allPermissions, onClose, onSaved }: { role?: Role; allPermissions: Permission[]; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!role
  const [form, setForm] = useState({
    applicationCode: role?.applicationCode ?? 'CONTRACT_MON',
    code: role?.code ?? '',
    name: role?.name ?? '',
    description: role?.description ?? '',
    permissionCodes: role?.permissions.map(p => p.code) ?? []
  })
  const [saving, setSaving] = useState(false)

  const groupedPerms = allPermissions.reduce((acc, p) => {
    if (!acc[p.resource]) acc[p.resource] = []
    acc[p.resource].push(p)
    return acc
  }, {} as Record<string, Permission[]>)

  function togglePermission(code: string) {
    setForm(f => ({
      ...f,
      permissionCodes: f.permissionCodes.includes(code)
        ? f.permissionCodes.filter(c => c !== code)
        : [...f.permissionCodes, code]
    }))
  }

  async function handleSubmit() {
    if (!form.code || !form.name || !form.applicationCode) { toast.error('Please fill all required fields'); return }
    setSaving(true)
    try {
      const url = isEdit ? `/api/roles/${role!.id}` : '/api/roles'
      const method = isEdit ? 'PUT' : 'POST'
      const body = isEdit
        ? { name: form.name, description: form.description || null, permissionCodes: form.permissionCodes }
        : { applicationCode: form.applicationCode, code: form.code, name: form.name, description: form.description || null, permissionCodes: form.permissionCodes }
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0] ?? data?.message ?? 'Failed')
      toast.success(isEdit ? 'Role updated!' : 'Role created!')
      onSaved(); onClose()
    } catch (e: any) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
          <h2 className="font-semibold">{isEdit ? 'Edit Role' : 'Add Role'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {!isEdit && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Application <span className="text-rose-500">*</span></label>
              <select value={form.applicationCode} onChange={e => setForm(f => ({ ...f, applicationCode: e.target.value }))}
                className="mt-1.5 w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                {APPS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          )}
          {!isEdit && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code <span className="text-rose-500">*</span></label>
              <input type="text" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                className="mt-1.5 w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                placeholder="e.g. CONTRACT_VIEWER" />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name <span className="text-rose-500">*</span></label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="mt-1.5 w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. Contract Viewer" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
            <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="mt-1.5 w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Optional description" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Permissions <span className="text-muted-foreground font-normal normal-case">({form.permissionCodes.length} selected)</span>
            </label>
            <div className="space-y-3">
              {Object.entries(groupedPerms).map(([resource, perms]) => (
                <div key={resource}>
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">{resource}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {perms.map(p => {
                      const selected = form.permissionCodes.includes(p.code)
                      return (
                        <button key={p.code} onClick={() => togglePermission(p.code)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all font-medium ${selected ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/50'}`}>
                          {p.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2 shrink-0">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Role'}</Button>
        </div>
      </div>
    </div>
  )
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; role?: Role } | null>(null)

  const fetchRoles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/roles')
      const data = await res.json()
      setRoles(data.data ?? [])
    } catch { toast.error('Failed to load roles') }
    finally { setLoading(false) }
  }, [])

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await fetch('/api/permissions')
      const data = await res.json()
      setAllPermissions(data.data ?? [])
    } catch {}
  }, [])

  useEffect(() => { fetchRoles(); fetchPermissions() }, [fetchRoles, fetchPermissions])

  async function handleDelete(role: Role) {
    if (role.isSystemRole) { toast.error('Cannot delete system role'); return }
    if (!confirm(`Delete role "${role.name}"?`)) return
    try {
      const res = await fetch(`/api/roles/${role.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      toast.success('Role deleted')
      fetchRoles()
    } catch { toast.error('Failed to delete role') }
  }

  const grouped = roles.reduce((acc, role) => {
    if (!acc[role.applicationCode]) acc[role.applicationCode] = { name: role.applicationName, roles: [] }
    acc[role.applicationCode].roles.push(role)
    return acc
  }, {} as Record<string, { name: string; roles: Role[] }>)

  return (
    <div className="space-y-6">
      {modal?.open && <RoleModal role={modal.role} allPermissions={allPermissions} onClose={() => setModal(null)} onSaved={fetchRoles} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground text-sm mt-1">{roles.length} roles across {Object.keys(grouped).length} applications</p>
        </div>
        <Button className="gap-2" onClick={() => setModal({ open: true })}>
          <Plus className="w-4 h-4" /> Add Role
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Roles', value: roles.length, color: 'text-primary', bg: 'bg-primary/10', icon: Shield },
          { label: 'System Roles', value: roles.filter(r => r.isSystemRole).length, color: 'text-amber-600', bg: 'bg-amber-500/10', icon: Lock },
          { label: 'Unique Permissions', value: [...new Set(roles.flatMap(r => r.permissions.map(p => p.code)))].length, color: 'text-blue-600', bg: 'bg-blue-500/10', icon: Shield },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-xl px-6 py-12 text-center text-muted-foreground text-sm">Loading...</div>
      ) : (
        Object.entries(grouped).map(([appCode, { name: appName, roles: appRoles }]) => (
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
                        {role.isSystemRole && <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-semibold">System</span>}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {role.permissions.map(p => (
                          <span key={p.id} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${actionColors[p.action] ?? 'bg-muted text-muted-foreground'}`}>
                            {p.name}
                          </span>
                        ))}
                        {role.permissions.length === 0 && <span className="text-xs text-muted-foreground">No permissions</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => setModal({ open: true, role })}>
                        <Pencil className="w-3 h-3" />Edit
                      </Button>
                      {!role.isSystemRole && (
                        <Button variant="outline" size="sm" className="text-xs h-7 gap-1 text-rose-500 hover:text-rose-600 hover:border-rose-300" onClick={() => handleDelete(role)}>
                          <Trash2 className="w-3 h-3" />Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
