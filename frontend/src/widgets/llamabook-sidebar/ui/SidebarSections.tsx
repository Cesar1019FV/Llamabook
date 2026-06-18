import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconChevron, IconPlus } from '@/shared/ui/icons'
import { recentChatGroups } from '../model/data'
import { SidebarCuaderno } from './SidebarCuaderno'

import { SidebarAgentSection } from './SidebarAgentSection'
import { SidebarPDFSection } from './SidebarPDFSection'

export function SidebarSections() {
  const { t } = useTranslation()
  const {
    notebooks,
    openChat,
    currentChatId,
    closeMobileSidebar,
    searchQuery,
    openCreateNotebookModal,
  } = useLlamabookDashboard()

  const filteredChats = (title: string) => {
    if (!searchQuery) return true
    return title.toLowerCase().includes(searchQuery.toLowerCase())
  }

  const hasNotebooks = notebooks.length > 0

  return (
    <nav className="pb-2">
      <div className="mb-0.5">
        <div className="flex items-center justify-between py-2.5 pb-1.5 px-2 select-none">
          <span className="text-[11.5px] font-medium text-llama-fg-3 tracking-wide">{t('dashboard.sidebar.notebooks')}</span>
          <div className="relative group/tooltip">
            <button
              className="sb-section-add w-[18px] h-[18px] flex items-center justify-center rounded text-llama-fg-3 transition-all duration-100 hover:text-llama-fg hover:bg-white/[0.12] shrink-0"
              onClick={() => {
                openCreateNotebookModal()
              }}
              aria-label={t('dashboard.sidebar.newNotebook')}
              type="button"
            >
              <IconPlus className="w-3 h-3 stroke-[2.5]" />
            </button>
            <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded-md bg-llama-surface-2 border border-llama-border text-[11px] text-llama-fg-2 whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-100 group-hover/tooltip:opacity-100 z-[70]">
              {t('dashboard.sidebar.newNotebook')}
            </span>
          </div>
        </div>

        <div>
          {hasNotebooks ? (
            notebooks.map((notebook) => (
              <SidebarCuaderno
                key={notebook.id}
                notebook={notebook}
                activeChatId={currentChatId}
              />
            ))
          ) : (
            <div className="px-2.5 py-2 text-[12.5px] text-llama-fg-3 italic">
              {t('dashboard.sidebar.noNotebooks')}
            </div>
          )}
        </div>
      </div>

      <SidebarAgentSection />

      <SidebarPDFSection />

      <div className="mb-0.5">
        <div className="flex items-center justify-between py-2.5 pb-1.5 px-2 cursor-pointer select-none">
          <span className="text-[11.5px] font-medium text-llama-fg-3 tracking-wide">{t('dashboard.sidebar.recent')}</span>
          <IconChevron className="chevron w-3 h-3 stroke-llama-fg-3" />
        </div>

        <div>
          {recentChatGroups.map((group) => {
            const visibleChats = group.chats.filter((chat) => filteredChats(chat.title))
            if (visibleChats.length === 0) return null
            return (
              <div key={group.label}>
                <div className={clsx('px-2', group.label === 'today' ? 'py-0.5 pb-1' : 'pt-2 pb-1')}>
                  <span className="text-[10.5px] font-medium text-llama-fg-3 px-2">
                    {t(`dashboard.sidebar.${group.label}`)}
                  </span>
                </div>
                {visibleChats.map((chat) => (
                  <button
                    key={chat.id}
                    className={clsx(
                      'sb-chat block w-full min-w-0 py-[7px] px-2.5 rounded-lg text-llama-fg text-[13.5px] font-normal text-left transition-colors duration-100 whitespace-nowrap overflow-hidden text-ellipsis leading-[1.4]',
                      'hover:bg-llama-sidebar-hover hover:text-llama-fg',
                      currentChatId === chat.id && 'bg-llama-sidebar-active text-llama-fg active-indicator'
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      openChat(chat.id)
                      closeMobileSidebar()
                    }}
                  >
                    {chat.title}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
