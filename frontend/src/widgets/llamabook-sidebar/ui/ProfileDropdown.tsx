import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { useAuth } from '@/features/auth'
import { IconSettings, IconLogout } from '@/shared/ui/icons'

interface MenuItem {
  id: string
  labelKey: string
  icon: React.FC<{ className?: string }>
  onClick?: () => void
  variant?: 'default' | 'danger'
}

export function ProfileDropdown() {
  const { t } = useTranslation()
  const { closeProfileDropdown, openSettingsModal } = useLlamabookDashboard()
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    closeProfileDropdown()
    await logout()
    navigate('/login')
  }

  const items: MenuItem[] = [
    {
      id: 'settings',
      labelKey: 'dashboard.profile.settings',
      icon: IconSettings,
      onClick: openSettingsModal,
    },
    {
      id: 'logout',
      labelKey: 'dashboard.profile.logout',
      icon: IconLogout,
      variant: 'danger',
      onClick: handleLogout,
    },
  ]

  return (
    <div className="absolute left-0 right-0 bottom-full mb-2 bg-llama-surface-2 border border-llama-border-2 rounded-xl p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] z-[70]">
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={clsx(
                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-left transition-colors duration-100',
                item.variant === 'danger'
                  ? 'text-llama-error hover:bg-white/[0.06]'
                  : 'text-llama-fg-2 hover:bg-white/[0.06] hover:text-llama-fg'
              )}
              onClick={item.onClick}
            >
              <Icon className="w-4 h-4 stroke-[1.8]" />
              <span>{t(item.labelKey)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
