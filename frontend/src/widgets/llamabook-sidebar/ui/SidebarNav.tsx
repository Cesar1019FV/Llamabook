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
  onClick?: () => void
}

export function SidebarNav() {
  const { t } = useTranslation()
  const { currentView, showDashboard, showNotebooksList, showAgentsList, showPDFChatList, showLibrary } = useLlamabookDashboard()

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
      disabled: true,
    },
    {
      id: 'notebooks',
      labelKey: 'dashboard.sidebar.notebooksMenu',
      icon: IconDocument,
      variant: 'default',
      onClick: showNotebooksList,
    },
    {
      id: 'workspace',
      labelKey: 'dashboard.sidebar.agents',
      icon: IconWorkspace,
      variant: 'default',
      onClick: showAgentsList,
    },
    {
      id: 'pdf-chat',
      labelKey: 'dashboard.sidebar.pdfChat',
      icon: IconPDF,
      variant: 'default',
      onClick: showPDFChatList,
    },
    {
      id: 'library',
      labelKey: 'dashboard.sidebar.library',
      icon: IconLibrary,
      variant: 'default',
      onClick: showLibrary,
    },
  ]

  const isActive = currentView === 'dashboard'

  return (
    <nav>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const Icon = item.icon
          const active =
            (item.id === 'new-chat' && isActive) ||
            (item.id === 'notebooks' && currentView === 'notebooks-list') ||
            (item.id === 'workspace' &&
              (currentView === 'agents-list' || currentView === 'agent-detail')) ||
            (item.id === 'pdf-chat' &&
              (currentView === 'pdf-chat-list' || currentView === 'pdf-chat-detail')) ||
            (item.id === 'library' && currentView === 'library')
          return (
            <li key={item.id} className="min-w-0">
              <button
                className={clsx(
                  'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-normal text-left transition-colors duration-150',
                  item.disabled
                    ? 'text-llama-fg-4 cursor-default'
                    : 'text-llama-fg hover:bg-llama-sidebar-hover hover:text-llama-fg',
                  item.variant === 'primary' && !item.disabled && 'bg-llama-surface border border-llama-border text-llama-fg hover:bg-llama-surface-2 hover:border-llama-border-2',
                  active && 'bg-llama-sidebar-active text-llama-fg'
                )}
                onClick={item.onClick}
                disabled={item.disabled}
                aria-disabled={item.disabled}
              >
                <Icon className="w-4 h-4 stroke-[1.8] shrink-0" />
                <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{t(item.labelKey)}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
