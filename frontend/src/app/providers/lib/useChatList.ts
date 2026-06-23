import { useState, useCallback, useEffect } from 'react'
import type { Chat } from '@/entities/llamabook-chat'
import {
  listChatsApi,
  updateChatApi,
  deleteChatApi,
} from '@/features/chat'

export function useChatList({
  currentChatId,
  showDashboard,
}: {
  currentChatId: string | null
  showDashboard: () => void
}) {
  const [chats, setChats] = useState<Chat[]>([])

  const refreshChats = useCallback(async () => {
    try {
      const list = await listChatsApi()
      setChats(list)
    } catch {
      // ignore network errors; sidebar will just show empty
    }
  }, [])

  const pinChat = useCallback(
    async (chatId: string, pinned: boolean) => {
      setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, pinned } : c)))
      try {
        await updateChatApi(chatId, { pinned })
        await refreshChats()
      } catch {
        setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, pinned: !pinned } : c)))
      }
    },
    [refreshChats]
  )

  const renameChat = useCallback(
    async (chatId: string, title: string) => {
      const trimmed = title.trim()
      if (!trimmed) return
      setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, title: trimmed } : c)))
      try {
        await updateChatApi(chatId, { title: trimmed })
        await refreshChats()
      } catch {
        await refreshChats()
      }
    },
    [refreshChats]
  )

  const deleteChat = useCallback(
    async (chatId: string) => {
      setChats((prev) => prev.filter((c) => c.id !== chatId))
      if (currentChatId === chatId) {
        showDashboard()
      }
      try {
        await deleteChatApi(chatId)
        await refreshChats()
      } catch {
        await refreshChats()
      }
    },
    [currentChatId, refreshChats, showDashboard]
  )

  useEffect(() => {
    void refreshChats()
  }, [refreshChats])

  return {
    chats,
    setChats,
    refreshChats,
    pinChat,
    renameChat,
    deleteChat,
  }
}
