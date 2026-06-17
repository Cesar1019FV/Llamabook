import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconChevron, IconPlus } from '@/shared/ui/icons'
import { recentChatGroups } from '../model/data'
import { SidebarCuaderno } from './SidebarCuaderno'

export function SidebarSections() {
  const { t } = useTranslation()
  const {
    notebooks,
    expandedNotebooks,
    toggleNotebook,
    addNotebook,
    openChat,
    currentChatId,
    closeMobileSidebar,
    searchQuery,
  } = useLlamabookDashboard()

  const filteredChats = (title: string) => {
    if (!searchQuery) return true
    return title.toLowerCase().includes(searchQuery.toLowerCase())
  }

  const handleSectionToggle = (id: string) => {
    if (id === 'notebooks') {
      toggleNotebook('notebooks-section')
    }
  }

  const notebooksExpanded = expandedNotebooks.has('notebooks-section')

  return (
    <nav className="sb-nav">
      <div className={clsx('sb-section', !notebooksExpanded && 'collapsed')}>
        <div
          className="sb-section-hdr"
          onClick={() => handleSectionToggle('notebooks')}
        >
          <span className="sb-section-title">{t('dashboard.sidebar.notebooks')}</span>
          <div className="sb-section-hdr-right">
            <button
              className="sb-section-add"
              onClick={(e) => {
                e.stopPropagation()
                const name = window.prompt(t('dashboard.sidebar.addNotebookPrompt'))
                if (name?.trim()) addNotebook(name)
              }}
              aria-label={t('dashboard.sidebar.newNotebook')}
              title={t('dashboard.sidebar.newNotebook')}
            >
              <IconPlus />
            </button>
            <IconChevron className="chevron" />
          </div>
        </div>
        <div className="sb-section-body">
          {notebooks.map((notebook) => (
            <SidebarCuaderno
              key={notebook.id}
              notebook={notebook}
              activeChatId={currentChatId}
            />
          ))}
        </div>
      </div>

      <div className="sb-section">
        <div className="sb-section-hdr">
          <span className="sb-section-title">{t('dashboard.sidebar.recent')}</span>
          <IconChevron className="chevron" />
        </div>
        <div className="sb-section-body">
          {recentChatGroups.map((group) => {
            const visibleChats = group.chats.filter((chat) => filteredChats(chat.title))
            if (visibleChats.length === 0) return null
            return (
              <div key={group.label}>
                <div style={{ padding: group.label === 'today' ? '2px 0 4px' : '8px 0 4px' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      color: 'var(--fg-5)',
                      padding: '0 8px',
                      fontWeight: 500,
                    }}
                  >
                    {t(`dashboard.sidebar.${group.label}`)}
                  </span>
                </div>
                {visibleChats.map((chat) => (
                  <button
                    key={chat.id}
                    className={clsx('sb-chat', currentChatId === chat.id && 'active')}
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
