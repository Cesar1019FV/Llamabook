import { createContext } from 'react'
import type { User, UserPreferences } from '@/entities/user'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  updateProfile: (data: { name: string }) => Promise<User>
  syncPreferences: (preferences: UserPreferences) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)