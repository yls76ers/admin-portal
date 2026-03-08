'use client'
import { useState } from 'react'
import { KeyRound, RefreshCw, Trash2, Info, Clock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function TokensPage() {
  const [revoking, setRevoking] = useState(false)

  async function handleRevoke() {
    setRevoking(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast.success('Session revoked — redirecting to login...')
      setTimeout(() => { window.location.href = '/login' }, 1500)
    } catch {
      toast.error('Failed to revoke session')
      setRevoking(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Token Manager</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage active sessions and access tokens</p>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4 flex gap-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700">
          IAM Service does not currently expose a sessions endpoint. Token management is limited to revoking your own session. Full session management will be available when the IAM Service adds a sessions API.
        </div>
      </div>

      {/* Token Info */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">How Tokens Work</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { icon: Shield, label: 'Access Token', desc: 'Short-lived JWT stored in httpOnly cookie. Valid for 15 minutes. Decoded locally without hitting IAM Service.', color: 'text-blue-600', bg: 'bg-blue-500/10' },
            { icon: RefreshCw, label: 'Refresh Token', desc: 'Long-lived token stored in httpOnly cookie. Valid for 7 days. Used to obtain a new access token when expired.', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
            { icon: Clock, label: 'Auto Expiry', desc: 'Access tokens expire after 15 minutes. User will be redirected to login when token expires and no valid refresh token is available.', color: 'text-amber-600', bg: 'bg-amber-500/10' },
            { icon: Trash2, label: 'Revocation', desc: 'Revoking a session calls POST /auth/revoke on IAM Service which invalidates the refresh token. User must login again.', color: 'text-rose-500', bg: 'bg-rose-500/10' },
          ].map(item => (
            <div key={item.label} className="px-6 py-4 flex gap-4">
              <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div>
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Session Actions */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Current Session</h2>
        </div>
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Active Session</div>
            <div className="text-xs text-muted-foreground mt-0.5">You are currently logged in. Revoking will log you out immediately.</div>
          </div>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleRevoke}
            disabled={revoking}
          >
            <Trash2 className="w-4 h-4" />
            {revoking ? 'Revoking...' : 'Revoke Session'}
          </Button>
        </div>
      </div>
    </div>
  )
}
