import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'

export function SidebarSearch() {
  const { t } = useTranslation()
  const { searchQuery, setSearchQuery } = useLlamabookDashboard()

  return (
    <div className="px-3 pb-1.5 shrink-0">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t('dashboard.sidebar.searchPlaceholder')}
        aria-label={t('dashboard.sidebar.search')}
        className="w-full py-[7px] px-2.5 border-0 rounded-lg bg-white/[0.08] text-llama-fg-2 text-[13px] font-normal transition-colors duration-150 placeholder:text-llama-fg-5 focus:bg-white/[0.12] focus:outline-none"
      />
    </div>
  )
}
