import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconPlus, IconSearch, IconDocument, IconWorkspace, IconPDF, IconLibrary } from '@/shared/ui/icons'

interface NavItem {
  id: string
  labelKey: string
  icon: React.FC<{ className?: string }>
  variant: 'primary' | 'default'
  disabled?: boolean
  comingSoon?: boolean
  onClick?: () => void
}

export function SidebarNav() {
  const { t } = useTranslation()
  const { currentView, showDashboard } = useLlamabookDashboard()

  const items: NavItem[] = [
    {
      id: 'new-chat',
      labelKey: 'dashboard.sidebar.newChat',
      icon: IconPlus,
      variant: 'primary',
      onClick: showDashboard,
    },
    {
      id: 'search',
      labelKey: 'dashboard.sidebar.search',
      icon: IconSearch,
      variant: 'default',
      comingSoon: true,
    },
    {
      id: 'notebooks',
      labelKey: 'dashboard.sidebar.notebooksMenu',
      icon: IconDocument,
      variant: 'default',
      comingSoon: true,
    },
    {
      id: 'workspace',
      labelKey: 'dashboard.sidebar.agents',
      icon: IconWorkspace,
      variant: 'default',
      comingSoon: true,
    },
    {
      id: 'pdf-chat',
      labelKey: 'dashboard.sidebar.pdfChat',
      icon: IconPDF,
      variant: 'default',
      comingSoon: true,
    },
    {
      id: 'library',
      labelKey: 'dashboard.sidebar.library',
      icon: IconLibrary,
      variant: 'default',
      comingSoon: true,
    },
  ]

  const isActive = currentView === 'dashboard'

  return (
    <nav>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const Icon = item.icon
          const active = item.id === 'new-chat' && isActive
          const disabled = item.comingSoon || item.disabled
          return (
            <li key={item.id} className="min-w-0">
              <button
                className={clsx(
                  'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-normal text-left transition-colors duration-150',
                  disabled
                    ? 'text-llama-fg-4 cursor-default opacity-60'
                    : 'text-llama-fg hover:bg-llama-sidebar-hover hover:text-llama-fg',
                  item.variant === 'primary' && !disabled && 'bg-llama-surface border border-llama-border text-llama-fg hover:bg-llama-surface-2 hover:border-llama-border-2',
                  active && 'bg-llama-sidebar-active text-llama-fg'
                )}
                onClick={item.onClick}
                disabled={disabled}
                aria-disabled={disabled}
              >
                <Icon className="w-4 h-4 stroke-[1.8] shrink-0" />
                <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{t(item.labelKey)}</span>
                {item.comingSoon && (
                  <span className="ml-auto text-[9px] font-medium uppercase tracking-wide text-llama-fg-5 px-1.5 py-0.5 rounded bg-white/[0.05] shrink-0">
                    {t('dashboard.sidebar.comingSoon')}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
