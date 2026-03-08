import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
export default async function UsersPage() {
  const session = await requireAuth()
  if (!session) redirect('/login')
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage user accounts and assignments</p>
      </div>
      <div className="border border-dashed border-border rounded-xl p-12 text-center">
        <div className="text-4xl mb-4">👥</div>
        <div className="font-semibold text-lg mb-2">User Management</div>
        <p className="text-muted-foreground text-sm">CRUD users, assign roles per application — coming soon</p>
      </div>
    </div>
  )
}
