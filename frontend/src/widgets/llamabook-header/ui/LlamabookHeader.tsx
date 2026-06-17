import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'
import { IconMenu, IconSidebar, IconHome } from '@/shared/ui/icons'
import { ModelSelector } from './ModelSelector'
import './LlamabookHeader.css'

export function LlamabookHeader() {
  const { t } = useTranslation()
  const {
    currentView,
    toggleSidebar,
    openMobileSidebar,
    showDashboard,
  } = useLlamabookDashboard()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <header className="llamabook-header">
      <div className="h-left">
        {isMobile && (
          <button
            className="h-btn"
            onClick={openMobileSidebar}
            aria-label={t('dashboard.header.menu')}
          >
            <IconMenu />
          </button>
        )}
        <button
          className="h-btn"
          onClick={toggleSidebar}
          aria-label={t('dashboard.header.sidebarToggle')}
        >
          <IconSidebar />
        </button>
      </div>

      <ModelSelector />

      <div className="h-right">
        {currentView === 'chat' && (
          <button
            className="h-btn"
            onClick={showDashboard}
            aria-label={t('dashboard.header.backToDashboard')}
          >
            <IconHome />
          </button>
        )}
      </div>
    </header>
  )
}
