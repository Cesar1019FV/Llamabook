import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'
import { IconCloseSidebar } from '@/shared/ui/icons'

export function SidebarHeader() {
  const { t } = useTranslation()
  const { toggleSidebar, closeMobileSidebar } = useLlamabookDashboard()

  return (
    <div className="flex items-center justify-between pt-3.5 pb-1.5 px-3 shrink-0">
      <div className="text-[15px] font-semibold text-llama-fg tracking-tight px-1">
        {t('dashboard.brand')}
        <span className="font-light text-llama-fg-3">AI</span>
      </div>
      <div className="flex gap-0.5">
        <button
          className="sb-btn w-[30px] h-[30px] flex items-center justify-center rounded-md text-llama-fg transition-colors duration-150 hover:bg-llama-sidebar-hover hover:text-llama-fg"
          onClick={() => {
            toggleSidebar()
            closeMobileSidebar()
          }}
          aria-label={t('dashboard.sidebar.closeSidebar')}
        >
          <IconCloseSidebar className="w-4 h-4 stroke-2" />
        </button>
      </div>
    </div>
  )
}
