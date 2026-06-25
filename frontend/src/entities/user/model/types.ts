export type UserRole = 'admin' | 'user'

export interface TriggerSettings {
  enabled: boolean
  webSearch: string[]
  thinking: string[]
}

export interface UserPreferences {
  triggers?: TriggerSettings | null
}

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  is_active: boolean
  preferences?: UserPreferences | null
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