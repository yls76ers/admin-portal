'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, ShieldCheck, AppWindow,
  KeyRound, HeartPulse, ScrollText, Settings, Zap
} from 'lucide-react'

const navItems = [
  { label: 'Overview', items: [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  ]},
  { label: 'IAM Service', items: [
    { href: '/users', icon: Users, label: 'Users' },
    { href: '/roles', icon: ShieldCheck, label: 'Roles & Permissions' },
    { href: '/apps', icon: AppWindow, label: 'Applications' },
    { href: '/tokens', icon: KeyRound, label: 'Token Manager' },
  ]},
  { label: 'System', items: [
    { href: '/health', icon: HeartPulse, label: 'Health Monitor' },
    { href: '/audit', icon: ScrollText, label: 'Audit Log' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]},
]

interface SidebarProps {
  user: { email: string; fullName?: string; roles?: string[] }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-bold text-sm leading-tight">Admin Portal</div>
          <div className="text-[10px] text-muted-foreground font-mono">v1.0 · DWIREGIONAL</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navItems.map(group => (
          <div key={group.label}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 mb-1.5">
              {group.label}
            </p>
            {group.items.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5',
                    active
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-accent/50">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">{user.email}</div>
            <div className="text-[10px] text-muted-foreground">{user.roles?.[0] ?? 'SysAdmin'}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
