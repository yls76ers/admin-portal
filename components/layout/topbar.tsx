'use client'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { LogOut, Bell, Search } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/roles': 'Roles & Permissions',
  '/apps': 'Applications',
  '/tokens': 'Token Manager',
  '/health': 'Health Monitor',
  '/audit': 'Audit Log',
  '/settings': 'Settings',
}

interface TopbarProps {
  user: { email: string; displayName?: string }
}

export default function Topbar({ user }: TopbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? 'Admin Portal'

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Logged out successfully')
    window.location.href = '/login'
  }

  return (
    <header className="h-16 border-b border-border bg-background flex items-center px-6 gap-4 shrink-0 shadow-sm">
      <div className="flex-1">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-1.5 text-sm text-muted-foreground w-52 cursor-text hover:border-emerald-300 transition-colors">
        <Search className="w-3.5 h-3.5" />
        <span className="text-xs">Search...</span>
        <span className="ml-auto text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">⌘K</span>
      </div>

      <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-foreground">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
      </Button>

      <div className="flex items-center gap-2 pl-3 border-l border-border">
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
          {user.email?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm text-foreground hidden sm:block">{user.displayName ?? user.email}</span>
      </div>

      <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="text-muted-foreground hover:text-rose-500">
        <LogOut className="w-4 h-4" />
      </Button>
    </header>
  )
}
