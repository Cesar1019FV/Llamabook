import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import type { Notebook } from '@/entities/llamabook-notebook'

interface SidebarCuadernoProps {
  notebook: Notebook
}

function NotebookAvatar({ name, color }: { name: string; color: string }) {
  const initial = name.charAt(0).toUpperCase()
  return (
    <div
      className="w-[18px] h-[18px] rounded-md flex items-center justify-center text-[10px] font-semibold shrink-0 text-white"
      style={{ background: color }}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}

export function SidebarCuaderno({ notebook }: SidebarCuadernoProps) {
  const { currentChatId, showNotebookDetail } = useLlamabookDashboard()
  const isActive = currentChatId === notebook.id

  return (
    <div
      className={clsx(
        'sb-cuaderno flex items-center gap-2 w-full min-w-0 py-[7px] px-2.5 rounded-lg text-llama-fg text-[13.5px] font-normal text-left transition-colors duration-100 cursor-pointer',
        'hover:bg-llama-sidebar-hover hover:text-llama-fg',
        isActive && 'bg-llama-sidebar-active text-llama-fg'
      )}
      onClick={() => showNotebookDetail(notebook.id)}
    >
      <NotebookAvatar name={notebook.name} color={notebook.color} />
      <span className="sb-cuaderno-name flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{notebook.name}</span>
      <span className="sb-cuaderno-count text-[11px] text-llama-fg-3 shrink-0">{notebook.chats.length}</span>
    </div>
  )
}