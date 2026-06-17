import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconMenu, IconSidebar, IconHome } from '@/shared/ui/icons'
import { ModelSelector } from './ModelSelector'

export function LlamabookHeader() {
  const { t } = useTranslation()
  const { currentView, toggleSidebar, openMobileSidebar, showDashboard } = useLlamabookDashboard()

  return (
    <header className="h-12 flex items-center px-4 md:px-5 border-b border-llama-border shrink-0 relative">
      <div className="h-left flex items-center gap-1">
        <button
          className="h-btn md:hidden w-8 h-8 flex items-center justify-center rounded-md text-llama-fg-3 transition-colors duration-150 hover:bg-llama-surface hover:text-llama-fg"
          onClick={openMobileSidebar}
          aria-label={t('dashboard.header.menu')}
        >
          <IconMenu className="w-[18px] h-[18px] stroke-[1.8]" />
        </button>
        <button
          className="h-btn w-8 h-8 flex items-center justify-center rounded-md text-llama-fg-3 transition-colors duration-150 hover:bg-llama-surface hover:text-llama-fg"
          onClick={toggleSidebar}
          aria-label={t('dashboard.header.sidebarToggle')}
        >
          <IconSidebar className="w-[18px] h-[18px] stroke-[1.8]" />
        </button>
      </div>

      <ModelSelector />

      <div className="h-right flex items-center gap-0.5">
        <button
          className={clsx(
            'h-btn w-8 h-8 flex items-center justify-center rounded-md text-llama-fg-3 transition-colors duration-150 hover:bg-llama-surface hover:text-llama-fg',
            currentView !== 'chat' && 'hidden'
          )}
          onClick={showDashboard}
          aria-label={t('dashboard.header.backToDashboard')}
        >
          <IconHome className="w-[18px] h-[18px] stroke-[1.8]" />
        </button>
      </div>
    </header>
  )
}
