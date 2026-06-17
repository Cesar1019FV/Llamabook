import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'
import { IconCloseSidebar } from '@/shared/ui/icons'

export function SidebarHeader() {
  const { t } = useTranslation()
  const { toggleSidebar, closeMobileSidebar } = useLlamabookDashboard()

  return (
    <div className="sb-head">
      <div className="sb-brand">
        {t('dashboard.brand')}
        <span>AI</span>
      </div>
      <div className="sb-head-r">
        <button
          className="sb-btn"
          onClick={() => {
            toggleSidebar()
            closeMobileSidebar()
          }}
          aria-label={t('dashboard.sidebar.closeSidebar')}
        >
          <IconCloseSidebar />
        </button>
      </div>
    </div>
  )
}
