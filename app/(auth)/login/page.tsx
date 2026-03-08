'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@iam.local')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Login failed')
      }
      toast.success('Login successful! Redirecting...')
      setTimeout(() => { window.location.href = '/dashboard' }, 500)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            ⚡
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">Admin Portal</div>
            <div className="text-xs text-muted-foreground font-mono">IAM & App Management</div>
          </div>
        </div>
        <div className="border border-border rounded-2xl p-6 bg-card shadow-xl">
          <h1 className="text-xl font-bold mb-1">Sign in</h1>
          <p className="text-sm text-muted-foreground mb-6">Enter your credentials to continue</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@iam.local" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          Admin Portal v1.0 · yls76ers/admin-portal
        </p>
      </div>
    </div>
  )
}
