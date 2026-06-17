import { useLlamabookDashboard } from '@/app/providers'
import type { Notebook } from '@/entities/llamabook-notebook'

interface SidebarCuadernoProps {
  notebook: Notebook
  activeChatId: string | null
}

export function SidebarCuaderno({ notebook, activeChatId }: SidebarCuadernoProps) {
  const { expandedNotebooks, toggleNotebook, openChat, currentChatId } = useLlamabookDashboard()
  const expanded = expandedNotebooks.has(notebook.id)
  const isActive = currentChatId === notebook.id

  return (
    <>
      <div
        className={['sb-cuaderno', isActive ? 'active' : ''].filter(Boolean).join(' ')}
        onClick={() => toggleNotebook(notebook.id)}
      >
        <div className="sb-cuaderno-icon" style={{ background: notebook.color }}>
          {notebook.emoji}
        </div>
        <span className="sb-cuaderno-name">{notebook.name}</span>
        <span className="sb-cuaderno-count">{notebook.chats.length}</span>
      </div>
      {expanded && (
        <div className="sb-cuaderno-chats" style={{ maxHeight: 200 }}>
          {notebook.chats.map((chat, idx) => (
            <button
              key={`${notebook.id}-${idx}`}
              className={['sb-cuaderno-chat', activeChatId === chat ? 'active' : ''].filter(Boolean).join(' ')}
              onClick={(e) => {
                e.stopPropagation()
                openChat(chat)
              }}
            >
              {chat}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
