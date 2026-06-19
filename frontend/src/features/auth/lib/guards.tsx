import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../model/useAuth'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-llama-bg">
        <div className="text-llama-fg-4 text-sm">Cargando...</div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export function RequireGuest({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-llama-bg">
        <div className="text-llama-fg-4 text-sm">Cargando...</div>
      </div>
    )
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-llama-bg">
        <div className="text-llama-fg-4 text-sm">Cargando...</div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}