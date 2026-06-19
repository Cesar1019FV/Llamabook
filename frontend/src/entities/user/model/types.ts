export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  is_active: boolean
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  name?: string | null
}