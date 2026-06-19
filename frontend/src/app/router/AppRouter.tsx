import { Routes, Route, Navigate } from 'react-router-dom'
import { LlamabookDashboard } from '@/pages/llamabook-dashboard'
import { LoginPage } from '@/pages/login'
import { SignupPage } from '@/pages/signup'
import { RequireAuth, RequireGuest } from '@/features/auth'

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <LlamabookDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/login"
        element={
          <RequireGuest>
            <LoginPage />
          </RequireGuest>
        }
      />
      <Route
        path="/signup"
        element={
          <RequireGuest>
            <SignupPage />
          </RequireGuest>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}