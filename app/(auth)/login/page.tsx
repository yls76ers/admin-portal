'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Zap, Shield, Users, Activity } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [versionId, setVersionId] = useState('© 2026 MACCOM LABS · Admin Portal v1.0')

  useEffect(() => {
    fetch('/api/version').then(r => r.json()).then(d => setVersionId(d.version)).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Login failed')
      toast.success('Welcome back!')
      setTimeout(() => { window.location.href = '/dashboard' }, 300)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-background font-bold text-lg">Admin Portal</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-background leading-tight mb-4">
            Manage your<br />IAM infrastructure<br />with confidence.
          </h1>
          <p className="text-background/60 text-base leading-relaxed">
            Centralized identity and access management for Contract Monitoring and Rig Monitoring systems.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: Users, label: 'User Management', desc: 'Create, edit, and manage user accounts' },
              { icon: Shield, label: 'Role-Based Access', desc: 'Fine-grained permissions per application' },
              { icon: Activity, label: 'Health Monitoring', desc: 'Real-time service health tracking' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-background/80" />
                </div>
                <div>
                  <div className="text-background text-sm font-semibold">{item.label}</div>
                  <div className="text-background/50 text-xs">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-background/30 text-xs">
          {versionId}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">Admin Portal</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
            <p className="text-muted-foreground text-sm mt-1.5">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required autoFocus
                className="mt-1.5 w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required
                className="mt-1.5 w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs px-3.5 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              {versionId}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
