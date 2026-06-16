import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/shared/i18n/config'
import '@/app/styles/index.css'
import { AppRouter } from './router'

function AppProviders() {
  return (
    <StrictMode>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<AppProviders />)
