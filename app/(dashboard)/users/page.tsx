import { cookies } from "next/headers"

export default async function UsersPage() {

  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value

  const res = await fetch(
    process.env.IAM_BASE_URL + "/api/v1/users",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  )

  const json = await res.json()
  const users = json.data ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Application</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-b">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.displayName}</td>
                <td className="p-3">{u.applicationCode}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  )
}
