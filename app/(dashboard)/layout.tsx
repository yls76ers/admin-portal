import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import Sidebar from '@/components/layout/sidebar'
import Topbar from '@/components/layout/topbar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth()
  if (!session) redirect('/login')

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar user={{ email: session.user.email, displayName: session.user.displayName, roles: session.user.roles }} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar user={{ email: session.user.email, displayName: session.user.displayName }} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
