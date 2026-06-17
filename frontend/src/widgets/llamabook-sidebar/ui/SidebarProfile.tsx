import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { IconMore } from '@/shared/ui/icons'
import { useLlamabookDashboard } from '@/app/providers'
import { ProfileDropdown } from './ProfileDropdown'

export function SidebarProfile() {
  const { t } = useTranslation()
  const { profileDropdownOpen, openProfileDropdown, closeProfileDropdown } = useLlamabookDashboard()

  return (
    <div className="sb-foot px-3 py-2 border-t border-llama-border shrink-0 bg-llama-sidebar">
      <div className="relative">
        <div
          className="sb-profile flex items-center gap-2.5 p-2 rounded-lg transition-colors duration-150 cursor-pointer hover:bg-llama-sidebar-hover min-w-0"
          onClick={() => (profileDropdownOpen ? closeProfileDropdown() : openProfileDropdown())}
        >
          <div className="sb-av w-7 h-7 rounded-full bg-gradient-to-br from-llama-accent to-llama-accent-light flex items-center justify-center text-[12px] font-semibold text-white shrink-0">
            {t('dashboard.sidebar.profile.name')[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="sb-pname text-[13px] font-medium text-llama-fg-2 overflow-hidden text-ellipsis whitespace-nowrap">
              {t('dashboard.sidebar.profile.name')}
            </div>
            <div className="sb-ppro text-[11px] text-llama-fg-4 font-normal overflow-hidden text-ellipsis whitespace-nowrap">
              {t('dashboard.sidebar.profile.plan')}
            </div>
          </div>
          <button
            className={clsx(
              'sb-pmore w-7 h-7 flex items-center justify-center shrink-0 rounded-md transition-colors duration-150',
              profileDropdownOpen ? 'bg-llama-sidebar-active text-llama-fg' : 'text-llama-fg-4 hover:text-llama-fg-2'
            )}
            onClick={(e) => {
              e.stopPropagation()
              profileDropdownOpen ? closeProfileDropdown() : openProfileDropdown()
            }}
            aria-label={t('dashboard.profile.menu')}
            type="button"
          >
            <IconMore className="w-4 h-4 stroke-2" />
          </button>
        </div>
        {profileDropdownOpen && <ProfileDropdown />}
      </div>
    </div>
  )
}
