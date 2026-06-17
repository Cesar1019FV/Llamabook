import { useTranslation } from 'react-i18next'
import { IconMore } from '@/shared/ui/icons'

export function SidebarProfile() {
  const { t } = useTranslation()

  return (
    <div className="sb-foot px-3 py-2 border-t border-llama-border shrink-0">
      <div className="sb-profile flex items-center gap-2.5 p-2 rounded-lg transition-colors duration-150 cursor-pointer hover:bg-llama-sidebar-hover">
        <div className="sb-av w-7 h-7 rounded-full bg-gradient-to-br from-llama-accent to-llama-accent-light flex items-center justify-center text-[12px] font-semibold text-white shrink-0">
          {t('dashboard.sidebar.profile.name')[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="sb-pname text-[13px] font-medium text-llama-fg-2 overflow-hidden text-ellipsis whitespace-nowrap">
            {t('dashboard.sidebar.profile.name')}
          </div>
          <div className="sb-ppro text-[11px] text-llama-fg-4 font-normal">
            {t('dashboard.sidebar.profile.plan')}
          </div>
        </div>
        <div className="sb-pmore w-7 h-7 flex items-center justify-center">
          <IconMore className="w-4 h-4 stroke-llama-fg-4 stroke-2" />
        </div>
      </div>
    </div>
  )
}
