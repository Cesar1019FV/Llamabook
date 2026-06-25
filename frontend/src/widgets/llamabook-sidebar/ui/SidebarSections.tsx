import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { groupChatsByDate } from '@/features/chat'
import { IconChevron } from '@/shared/ui/icons'
import { ChatItem } from './ChatItem'

export function SidebarSections() {
  const { t } = useTranslation()
  const {
    openChat,
    currentChatId,
    searchQuery,
    chats,
  } = useLlamabookDashboard()

  const filteredChats = (title: string) => {
    if (!searchQuery) return true
    return title.toLowerCase().includes(searchQuery.toLowerCase())
  }

  const pinnedChats = chats.filter((c) => c.pinned)
  const chatGroups = groupChatsByDate(chats)

  return (
    <nav className="pb-2">
      {pinnedChats.length > 0 && (
        <div className="mb-0.5">
          <div className="flex items-center justify-between py-2.5 pb-1.5 px-2 select-none">
            <span className="text-[11.5px] font-medium text-llama-fg-3 tracking-wide">{t('dashboard.sidebar.pinned')}</span>
          </div>
          <div>
            {pinnedChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={currentChatId === chat.id}
                onOpen={() => void openChat(chat.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-0.5">
        <div className="flex items-center justify-between py-2.5 pb-1.5 px-2 cursor-pointer select-none">
          <span className="text-[11.5px] font-medium text-llama-fg-3 tracking-wide">{t('dashboard.sidebar.recent')}</span>
          <IconChevron className="chevron w-3 h-3 stroke-llama-fg-3" />
        </div>

        <div>
          {chatGroups.length === 0 && (
            <div className="px-2.5 py-2 text-[12.5px] text-llama-fg-3 italic">
              {t('dashboard.sidebar.noRecentChats')}
            </div>
          )}
          {chatGroups.map((group) => {
            const visibleChats = group.chats.filter((chat) =>
              filteredChats(chat.title ?? '')
            )
            if (visibleChats.length === 0) return null
            return (
              <div key={group.label}>
                <div className={clsx('px-2', group.label === 'today' ? 'py-0.5 pb-1' : 'pt-2 pb-1')}>
                  <span className="text-[10.5px] font-medium text-llama-fg-3 px-2">
                    {t(`dashboard.sidebar.${group.label}`)}
                  </span>
                </div>
                {visibleChats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={currentChatId === chat.id}
                    onOpen={() => void openChat(chat.id)}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}