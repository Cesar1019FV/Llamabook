import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'

export function SidebarSearch() {
  const { t } = useTranslation()
  const { searchQuery, setSearchQuery } = useLlamabookDashboard()

  return (
    <div className="sb-search">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t('dashboard.sidebar.searchPlaceholder')}
        aria-label={t('dashboard.sidebar.search')}
      />
    </div>
  )
}
