const IAM_BASE_URL = process.env.IAM_BASE_URL || 'http://localhost:5073'
const BASE = `${IAM_BASE_URL}/api/v1`
const APP_CODE = process.env.IAM_APP_CODE || 'CONTRACT_MON'

export interface LoginRequest { email: string; password: string }
export interface IamUser {
  id: string; email: string; displayName: string
  applicationCode: string; roles: string[]; permissions: string[]
}
export interface LoginResponse {
  accessToken: string; refreshToken: string
  accessTokenExpiry: string; refreshTokenExpiry: string; user: IamUser
}
export interface User {
  id: string; email: string; fullName: string
  isActive: boolean; roles: string[]; createdAt: string
}
export interface Role {
  id: string; name: string; description: string; permissions: string[]
}

async function fetchIAM(path: string, options: RequestInit = {}, token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || `IAM API error: ${res.status}`)
  }
  const json = await res.json()
  if (json.success === false) throw new Error(json.message || 'IAM error')
  return json.data ?? json
}

export const iamClient = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    fetchIAM('/auth/login', { method: 'POST', body: JSON.stringify({ ...data, applicationCode: APP_CODE }) }),

  refresh: (refreshToken: string) =>
    fetchIAM('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),

  revoke: (refreshToken: string, token: string) =>
    fetchIAM('/auth/revoke', { method: 'POST', body: JSON.stringify({ refreshToken }) }, token),

  validate: (token: string) =>
    fetchIAM('/auth/validate', { method: 'POST', body: JSON.stringify({ accessToken: token, applicationCode: APP_CODE }) }),

  getUsers: (token: string): Promise<User[]> =>
    fetchIAM('/users', {}, token),

  getUserById: (id: string, token: string): Promise<User> =>
    fetchIAM(`/users/${id}`, {}, token),

  createUser: (data: Partial<User> & { password: string }, token: string) =>
    fetchIAM('/users', { method: 'POST', body: JSON.stringify(data) }, token),

  updateUser: (id: string, data: Partial<User>, token: string) =>
    fetchIAM(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),

  deleteUser: (id: string, token: string) =>
    fetchIAM(`/users/${id}`, { method: 'DELETE' }, token),

  getRoles: (token: string): Promise<Role[]> =>
    fetchIAM('/roles', {}, token),

  createRole: (data: Partial<Role>, token: string) =>
    fetchIAM('/roles', { method: 'POST', body: JSON.stringify(data) }, token),

  updateRole: (id: string, data: Partial<Role>, token: string) =>
    fetchIAM(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),

  deleteRole: (id: string, token: string) =>
    fetchIAM(`/roles/${id}`, { method: 'DELETE' }, token),

  getPermissions: (token: string) =>
    fetchIAM('/permissions', {}, token),

  health: () =>
    fetch(`${IAM_BASE_URL}/health`).then(r => r.json()),
}
