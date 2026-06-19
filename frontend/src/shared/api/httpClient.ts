import { API_URL } from '@/shared/config'

export interface ApiError {
  code: string
  detail: string
  path?: string
}

interface RequestOptions {
  headers?: Record<string, string>
  skipAuth?: boolean
}

const TOKEN_KEY = 'llamabook:access_token:v1'
const REFRESH_KEY = 'llamabook:refresh_token:v1'

function getAccessToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_KEY)
  } catch {
    return null
  }
}

function setTokens(access: string, refresh: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  } catch {
    // storage might be unavailable (incognito, quota, disabled)
  }
}

function clearTokens(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
  } catch {
    // ignore
  }
}

async function refreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!res.ok) {
      clearTokens()
      return false
    }

    const data = await res.json()
    setTokens(data.access_token, data.refresh_token)
    return true
  } catch {
    clearTokens()
    return false
  }
}

function isAuthEndpoint(path: string): boolean {
  return path === '/auth/login' || path === '/auth/register' || path === '/auth/refresh'
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    const body = await res.json()
    if (body.error?.code) {
      return { code: body.error.code, detail: body.error.detail, path: body.error.path }
    }
    return { code: 'unknown', detail: body.detail ?? 'Unknown error' }
  } catch {
    return { code: 'unknown', detail: `HTTP ${res.status}` }
  }
}

async function request<T>(
  path: string,
  options: RequestOptions & { method?: string; body?: unknown } = {},
): Promise<T> {
  const { method = 'GET', body, headers = {}, skipAuth = false } = options

  const finalHeaders: Record<string, string> = { ...headers }
  if (body && !(body instanceof FormData) && !headers['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  if (!skipAuth && !isAuthEndpoint(path)) {
    const token = getAccessToken()
    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && !skipAuth && !isAuthEndpoint(path)) {
    const refreshed = await refreshTokens()
    if (refreshed) {
      const newToken = getAccessToken()
      if (newToken) {
        finalHeaders['Authorization'] = `Bearer ${newToken}`
      }
      const retryRes = await fetch(`${API_URL}${path}`, {
        method,
        headers: finalHeaders,
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      })
      if (retryRes.status === 204) return undefined as T
      if (!retryRes.ok) throw await parseError(retryRes)
      return retryRes.status === 204 ? (undefined as T) : await retryRes.json()
    }
    clearTokens()
    throw await parseError(res)
  }

  if (res.status === 204) return undefined as T
  if (!res.ok) throw await parseError(res)

  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return await res.json()
  }
  return undefined as T
}

export const http = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'GET' })
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'POST', body })
  },

  postForm<T>(path: string, formData: FormData, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'POST', body: formData })
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'PATCH', body })
  },

  del<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'DELETE' })
  },
}

export { getAccessToken, getRefreshToken, setTokens, clearTokens }