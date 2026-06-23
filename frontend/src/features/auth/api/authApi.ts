import { http, setTokens, clearTokens } from '@/shared/api'
import type { AuthTokens, User, SignupData } from '@/entities/user'

export async function loginApi(email: string, password: string): Promise<AuthTokens> {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)

  const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1'}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw { code: body.error?.code ?? 'unknown', detail: body.error?.detail ?? 'Login failed' }
  }

  const tokens = await res.json()
  setTokens(tokens.access_token, tokens.refresh_token)
  return tokens
}

export async function registerApi(data: SignupData): Promise<User> {
  return http.post<User>('/auth/register', data, { skipAuth: true })
}

export async function meApi(): Promise<User> {
  return http.get<User>('/auth/me')
}

export async function updateMeApi(data: { name: string }): Promise<User> {
  return http.patch<User>('/auth/me', data)
}

export async function logoutApi(): Promise<void> {
  try {
    await http.post<void>('/auth/logout')
  } finally {
    clearTokens()
  }
}