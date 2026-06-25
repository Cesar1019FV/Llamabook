import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './auth-context'
import type { AuthContextValue } from './auth-context'
import type { User, UserPreferences } from '@/entities/user'
import { loginApi, registerApi, meApi, logoutApi, updateMeApi } from '../api/authApi'
import { getAccessToken, clearTokens } from '@/shared/api'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    let cancelled = false
    meApi()
      .then((u) => {
        if (!cancelled) setUser(u)
      })
      .catch(() => {
        if (!cancelled) clearTokens()
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await loginApi(email, password)
    const u = await meApi()
    setUser(u)
  }, [])

  const register = useCallback(async (email: string, password: string, name?: string) => {
    await registerApi({ email, password, name: name ?? null })
    await loginApi(email, password)
    const u = await meApi()
    setUser(u)
  }, [])

  const logout = useCallback(async () => {
    await logoutApi()
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (data: { name: string }) => {
    const updated = await updateMeApi(data)
    setUser(updated)
    return updated
  }, [])

  const syncPreferences = useCallback(async (preferences: UserPreferences) => {
    const updated = await updateMeApi({ preferences })
    setUser(updated)
  }, [])

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    updateProfile,
    syncPreferences,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}