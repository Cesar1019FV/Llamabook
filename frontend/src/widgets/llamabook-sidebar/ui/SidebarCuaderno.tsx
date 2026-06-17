import clsx from 'clsx'
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
        className={clsx(
          'sb-cuaderno flex items-center gap-2 w-full py-[7px] px-2.5 rounded-lg text-llama-fg-3 text-[13.5px] font-normal text-left transition-colors duration-100 cursor-pointer',
          'hover:bg-llama-sidebar-hover hover:text-llama-fg-2',
          isActive && 'bg-llama-sidebar-active text-llama-fg'
        )}
        onClick={() => toggleNotebook(notebook.id)}
      >
        <div
          className="sb-cuaderno-icon w-[18px] h-[18px] rounded flex items-center justify-center text-[11px] font-semibold shrink-0 text-white"
          style={{ background: notebook.color }}
        >
          {notebook.emoji}
        </div>
        <span className="sb-cuaderno-name flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{notebook.name}</span>
        <span className="sb-cuaderno-count text-[11px] text-llama-fg-5 shrink-0">{notebook.chats.length}</span>
      </div>

      <div
        className={clsx(
          'sb-cuaderno-chats pl-[18px] overflow-hidden transition-[max-height] duration-200',
          !expanded && 'hidden'
        )}
        style={{ maxHeight: expanded ? 200 : 0 }}
      >
        {notebook.chats.map((chat, idx) => (
          <button
            key={`${notebook.id}-${idx}`}
            className={clsx(
              'sb-cuaderno-chat block w-full py-[5px] px-2.5 rounded-md text-llama-fg-4 text-[12.5px] font-normal text-left transition-colors duration-100 whitespace-nowrap overflow-hidden text-ellipsis',
              'hover:bg-llama-sidebar-hover hover:text-llama-fg-2',
              activeChatId === chat && 'text-llama-fg bg-llama-sidebar-active'
            )}
            onClick={(e) => {
              e.stopPropagation()
              openChat(chat)
            }}
          >
            {chat}
          </button>
        ))}
      </div>
    </>
  )
}
