'use client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { LogOut, Bell } from 'lucide-react'

interface TopbarProps {
  user: { email: string; fullName?: string }
}

export default function Topbar({ user }: TopbarProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Logged out')
    router.push('/login')
  }

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4 shrink-0">
      <div className="flex-1" />
      <Button variant="ghost" size="icon">
        <Bell className="w-4 h-4" />
      </Button>
      <div className="text-sm text-muted-foreground hidden sm:block">
        {user.email}
      </div>
      <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
        <LogOut className="w-4 h-4" />
      </Button>
    </header>
  )
}
