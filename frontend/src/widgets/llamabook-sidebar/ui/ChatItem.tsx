import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import type { Chat } from '@/entities/llamabook-chat'
import { formatRelativeTime } from '@/features/chat'
import { IconMore } from '@/shared/ui/icons'

const MENU_WIDTH = 176
const MENU_GAP = 8

interface ChatItemProps {
  chat: Chat
  isActive: boolean
  onOpen: () => void
}

export function ChatItem({ chat, isActive, onOpen }: ChatItemProps) {
  const { t } = useTranslation()
  const { pinChat, renameChat, deleteChat, closeMobileSidebar } = useLlamabookDashboard()
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [draftTitle, setDraftTitle] = useState(chat.title ?? '')
  const [menuPos, setMenuPos] = useState<{ left: number; top: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  useEffect(() => {
    if (renaming) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [renaming])

  function openMenu() {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const left = rect.left - MENU_WIDTH - MENU_GAP
    const top = rect.top + rect.height / 2
    setMenuPos({ left, top })
    setMenuOpen(true)
  }

  function handleOpen() {
    if (renaming) return
    onOpen()
    closeMobileSidebar()
  }

  function handleTogglePin() {
    setMenuOpen(false)
    void pinChat(chat.id, !chat.pinned)
  }

  function startRename() {
    setDraftTitle(chat.title ?? '')
    setRenaming(true)
    setMenuOpen(false)
  }

  function commitRename() {
    setRenaming(false)
    const trimmed = draftTitle.trim()
    if (trimmed && trimmed !== chat.title) {
      void renameChat(chat.id, trimmed)
    }
  }

  function cancelRename() {
    setRenaming(false)
    setDraftTitle(chat.title ?? '')
  }

  function handleDelete() {
    setMenuOpen(false)
    void deleteChat(chat.id)
  }

  return (
    <div className="relative group/chat">
      {renaming ? (
        <div className="sb-chat flex w-full min-w-0 py-[7px] px-2.5 rounded-lg items-center gap-2 bg-llama-sidebar-active">
          <input
            ref={inputRef}
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                commitRename()
              } else if (e.key === 'Escape') {
                e.preventDefault()
                cancelRename()
              }
            }}
            onBlur={commitRename}
            className="flex-1 min-w-0 bg-transparent text-llama-fg text-[13.5px] font-normal outline-none border-b border-llama-accent/60 leading-[1.4]"
          />
        </div>
      ) : (
        <button
          className={clsx(
            'sb-chat flex w-full min-w-0 py-[7px] px-2.5 rounded-lg text-llama-fg text-[13.5px] font-normal text-left transition-colors duration-100 items-center gap-2',
            'hover:bg-llama-sidebar-hover hover:text-llama-fg',
            isActive && 'bg-llama-sidebar-active text-llama-fg active-indicator'
          )}
          onClick={handleOpen}
        >
          <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap leading-[1.4]">
            {chat.title ?? 'Untitled'}
          </span>
          <span className="text-[10.5px] text-llama-fg-5 shrink-0">
            {formatRelativeTime(chat.updated_at)}
          </span>
          <button
            ref={triggerRef}
            className={clsx(
              'w-5 h-5 flex items-center justify-center rounded-md text-llama-fg-4 transition-all duration-100 shrink-0',
              'hover:bg-white/[0.10] hover:text-llama-fg',
              menuOpen ? 'opacity-100' : 'opacity-0 group-hover/chat:opacity-100'
            )}
            onClick={(e) => {
              e.stopPropagation()
              if (menuOpen) setMenuOpen(false)
              else openMenu()
            }}
            aria-label={t('dashboard.chatMenu.options')}
            type="button"
          >
            <IconMore className="w-3.5 h-3.5 stroke-2" />
          </button>
        </button>
      )}

      {menuOpen && !renaming && menuPos && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            left: `${menuPos.left}px`,
            top: `${menuPos.top}px`,
            transform: 'translateY(-50%)',
            width: `${MENU_WIDTH}px`,
          }}
          className="bg-llama-surface-2 border border-llama-border-2 rounded-xl p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] z-[100]"
        >
          <div className="flex flex-col gap-0.5">
            <button
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-left transition-colors duration-100 text-llama-fg-2 hover:bg-white/[0.06] hover:text-llama-fg"
              onClick={handleTogglePin}
              type="button"
            >
              <span className="w-4 h-4 flex items-center justify-center shrink-0">
                {chat.pinned ? '★' : '☆'}
              </span>
              <span>{chat.pinned ? t('dashboard.chatMenu.unpin') : t('dashboard.chatMenu.pin')}</span>
            </button>
            <button
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-left transition-colors duration-100 text-llama-fg-2 hover:bg-white/[0.06] hover:text-llama-fg"
              onClick={startRename}
              type="button"
            >
              <span className="w-4 h-4 flex items-center justify-center shrink-0 text-[11px]">✎</span>
              <span>{t('dashboard.chatMenu.rename')}</span>
            </button>
            <button
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-left transition-colors duration-100 text-llama-error hover:bg-white/[0.06]"
              onClick={handleDelete}
              type="button"
            >
              <span className="w-4 h-4 flex items-center justify-center shrink-0 text-[11px]">🗑</span>
              <span>{t('dashboard.chatMenu.delete')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}