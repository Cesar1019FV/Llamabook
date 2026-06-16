import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '@/pages/landing-page'
import { HelloWorldPage } from '@/pages/hello-world-page'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/hello" element={<HelloWorldPage />} />
    </Routes>
  )
}
