import { Routes, Route } from 'react-router-dom'
import { LlamabookDashboard } from '@/pages/llamabook-dashboard'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LlamabookDashboard />} />
    </Routes>
  )
}
