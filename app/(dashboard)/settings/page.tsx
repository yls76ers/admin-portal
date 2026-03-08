import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Settings, Server, Shield, Bell, Database } from 'lucide-react'

export default async function SettingsPage() {
  const session = await requireAuth()
  if (!session) redirect('/login')

  const IAM_URL = process.env.IAM_BASE_URL ?? '-'
  const APP_CODE = process.env.IAM_APP_CODE ?? '-'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Admin Portal configuration & info</p>
      </div>

      {/* IAM Connection */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Server className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">IAM Service Connection</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { label: 'Base URL', value: IAM_URL },
            { label: 'Application Code', value: APP_CODE },
            { label: 'Auth Method', value: 'JWT Bearer Token (httpOnly Cookie)' },
            { label: 'Token Expiry', value: '15 minutes' },
            { label: 'Refresh Token Expiry', value: '7 days' },
            { label: 'JWT Decode', value: 'Local (jose) — no validate round-trip' },
          ].map(item => (
            <div key={item.label} className="px-6 py-3.5 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-mono font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Current Session</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { label: 'User', value: session.user.email },
            { label: 'Display Name', value: session.user.displayName ?? '-' },
            { label: 'Role', value: session.user.roles?.[0] ?? '-' },
            { label: 'Application', value: session.user.applicationCode ?? '-' },
            { label: 'Permissions', value: `${session.user.permissions?.length ?? 0} granted` },
          ].map(item => (
            <div key={item.label} className="px-6 py-3.5 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-mono font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Registered Services */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Registered Services</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { code: 'CONTRACT_MON', name: 'Contract Monitoring System', url: process.env.CONTRACT_MON_URL ?? 'Not configured' },
            { code: 'RIG_MON', name: 'Rig Movement & Monitoring', url: process.env.RIG_MON_URL ?? 'Not configured' },
          ].map(svc => (
            <div key={svc.code} className="px-6 py-3.5 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{svc.name}</div>
                <div className="text-xs font-mono text-muted-foreground">{svc.code}</div>
              </div>
              <span className={`text-xs font-mono ${svc.url === 'Not configured' ? 'text-amber-500' : 'text-emerald-600'}`}>
                {svc.url}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">About</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { label: 'App Name', value: 'Admin Portal' },
            { label: 'Version', value: '1.0.0' },
            { label: 'Framework', value: 'Next.js 15 + TypeScript' },
            { label: 'UI', value: 'shadcn/ui + Tailwind CSS' },
            { label: 'Theme', value: 'SpaceLinear (tweakcn.com)' },
            { label: 'Organization', value: 'DWIREGIONAL' },
          ].map(item => (
            <div key={item.label} className="px-6 py-3.5 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
