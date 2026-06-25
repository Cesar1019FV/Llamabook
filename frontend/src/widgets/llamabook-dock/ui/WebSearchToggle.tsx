import { useLlamabookDashboard } from '@/app/providers'
import { IconWebSearch } from '@/shared/ui/icons'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

export function WebSearchToggle() {
  const { t } = useTranslation()
  const { webSearchEnabled, setWebSearchEnabled, closePlusPopup, closeModelPopup } = useLlamabookDashboard()

  return (
    <button
      type="button"
      className={clsx(
        'dock-ws-toggle flex items-center gap-1 h-[30px] px-2 rounded-lg text-[12px] font-medium transition-all duration-150 shrink-0',
        webSearchEnabled
          ? 'text-llama-fg-2 bg-white/[0.06] hover:bg-white/[0.10]'
          : 'text-llama-fg-4 hover:bg-white/[0.06] hover:text-llama-fg-3'
      )}
      onClick={(e) => {
        e.stopPropagation()
        closePlusPopup()
        closeModelPopup()
        setWebSearchEnabled(!webSearchEnabled)
      }}
      aria-label={t('dashboard.dock.webSearch.label')}
      title={webSearchEnabled ? t('dashboard.dock.webSearch.onDesc') : t('dashboard.dock.webSearch.offDesc')}
    >
      <IconWebSearch className={clsx('w-[14px] h-[14px] shrink-0', webSearchEnabled && 'text-[#60a5fa]')} />
      {webSearchEnabled && <span className="whitespace-nowrap text-[11px]">{t('dashboard.dock.webSearch.label')}</span>}
    </button>
  )
}