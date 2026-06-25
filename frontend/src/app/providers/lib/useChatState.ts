import {
  useState,
  useCallback,
  useRef,
} from 'react'
import type { Message } from '@/entities/llamabook-message'
import type { Chat } from '@/entities/llamabook-chat'
import {
  createChatApi,
  listMessagesApi,
  sendMessageStreamApi,
  editMessageStreamApi,
  mapBackendMessages,
} from '@/features/chat'
import type { View } from '../model/types'
import type { ThinkMode } from './useThinkMode'

interface UseChatStateProps {
  currentView: View
  setCurrentView: (view: View) => void
  currentChatId: string | null
  setCurrentChatId: (id: string | null) => void
  setCurrentNotebookId: (id: string | null) => void
  setCurrentAgentId: (id: string | null) => void
  setCurrentPDFSourceId: (id: string | null) => void
  setCurrentPDFChatId: (id: string | null) => void
  setCurrentGeneratedDocId: (id: string | null) => void
  setCanvasOpen: (value: boolean | ((prev: boolean) => boolean)) => void
  setSidebarOpen: (value: boolean | ((prev: boolean) => boolean)) => void
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
  refreshChats: () => Promise<void>
  thinkMode: ThinkMode
  webSearchEnabled: boolean
  detectTriggers: (text: string) => { webSearch: boolean; webFetch: boolean; thinking: boolean; urls: string[] }
}

function thinkModeToParam(mode: ThinkMode): boolean | string | null {
  switch (mode) {
    case 'off':
      return false
    case 'on':
      return true
    case 'low':
    case 'medium':
    case 'high':
      return mode
    default:
      return null
  }
}

export function useChatState({
  currentView,
  setCurrentView,
  currentChatId,
  setCurrentChatId,
  setCurrentNotebookId,
  setCurrentAgentId,
  setCurrentPDFSourceId,
  setCurrentPDFChatId,
  setCurrentGeneratedDocId,
  setCanvasOpen,
  setChats,
  refreshChats,
  thinkMode,
  webSearchEnabled,
  detectTriggers,
}: UseChatStateProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<string[]>([])
  const [activeTools, setActiveTools] = useState<Set<string>>(new Set())
  const abortRef = useRef<AbortController | null>(null)

  const resetChatView = useCallback(() => {
    setCurrentChatId(null)
    setCurrentNotebookId(null)
    setCurrentAgentId(null)
    setCurrentPDFSourceId(null)
    setCurrentPDFChatId(null)
    setCurrentGeneratedDocId(null)
    setCanvasOpen(false)
    setAttachedFiles([])
  }, [
    setCurrentChatId,
    setCurrentNotebookId,
    setCurrentAgentId,
    setCurrentPDFSourceId,
    setCurrentPDFChatId,
    setCurrentGeneratedDocId,
    setCanvasOpen,
  ])

  const openChat = useCallback(
    async (id: string | 'new') => {
      if (
        id === 'new' ||
        !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)
      ) {
        setMessages([])
        setCurrentView('chat')
        resetChatView()
        return
      }
      setCurrentView('chat')
      setCurrentChatId(id)
      resetChatView()
      try {
        const backendMessages = await listMessagesApi(id)
        setMessages(mapBackendMessages(backendMessages))
      } catch {
        setMessages([])
      }
    },
    [setCurrentView, setCurrentChatId, resetChatView]
  )

  const startNewChat = useCallback(() => {
    setMessages([])
    setCurrentView('chat')
    setCurrentChatId(null)
    resetChatView()
  }, [setCurrentView, setCurrentChatId, resetChatView])

  const startNotebookChat = useCallback(
    (notebookId: string) => {
      setMessages([])
      setCurrentView('chat')
      setCurrentChatId(null)
      setCurrentNotebookId(notebookId)
      setCurrentAgentId(null)
      setCurrentPDFSourceId(null)
      setCurrentPDFChatId(null)
      setCurrentGeneratedDocId(null)
      setCanvasOpen(false)
      setAttachedFiles([])
    },
    [
      setCurrentView,
      setCurrentChatId,
      setCurrentNotebookId,
      setCurrentAgentId,
      setCurrentPDFSourceId,
      setCurrentPDFChatId,
      setCurrentGeneratedDocId,
      setCanvasOpen,
    ]
  )

  const startAgentChat = useCallback(
    (agentId: string) => {
      setMessages([])
      setCurrentView('chat')
      setCurrentChatId(null)
      setCurrentNotebookId(null)
      setCurrentAgentId(agentId)
      setCurrentPDFSourceId(null)
      setCurrentPDFChatId(null)
      setCurrentGeneratedDocId(null)
      setCanvasOpen(false)
      setAttachedFiles([])
    },
    [
      setCurrentView,
      setCurrentChatId,
      setCurrentNotebookId,
      setCurrentAgentId,
      setCurrentPDFSourceId,
      setCurrentPDFChatId,
      setCurrentGeneratedDocId,
      setCanvasOpen,
    ]
  )

  const toggleTool = useCallback((tool: string) => {
    setActiveTools((prev) => {
      const next = new Set(prev)
      if (next.has(tool)) next.delete(tool)
      else next.add(tool)
      return next
    })
  }, [])

  const stopGeneration = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    setIsGenerating(false)
  }, [])

  const attachFile = useCallback(() => {
    if (attachedFiles.length >= 3) return
    const names = ['config.yaml', 'schema.sql', 'notes.md', 'data.csv']
    const name = names[Math.floor(Math.random() * names.length)]
    if (!attachedFiles.includes(name)) {
      setAttachedFiles((prev) => [...prev, name])
    }
  }, [attachedFiles])

  const removeFile = useCallback((name: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f !== name))
  }, [])

  const sendMessage = useCallback(
    async (text: string) => {
      const txt = text.trim()
      if (!txt || isGenerating) return

      const now = new Date()
      const time =
        now.getHours().toString().padStart(2, '0') +
        ':' +
        now.getMinutes().toString().padStart(2, '0')

      if (currentView === 'dashboard') {
        setCurrentView('chat')
      }

      let chatId = currentChatId

      if (!chatId) {
        try {
          const chat = await createChatApi({})
          chatId = chat.id
          setCurrentChatId(chat.id)
        } catch (err) {
          console.error('Failed to create chat', err)
          return
        }
      }

      const activeChatId = chatId

      const userLocalKey = 'u-' + Date.now()
      setMessages((prev) => [
        ...prev,
        { id: userLocalKey, localKey: userLocalKey, type: 'user', text: txt, time, status: 'sent' },
      ])

      setAttachedFiles([])
      setIsGenerating(true)

      const aiLocalKey = 'a-' + Date.now()
      setMessages((prev) => [
        ...prev,
        {
          id: aiLocalKey,
          localKey: aiLocalKey,
          type: 'ai',
          text: '',
          time,
          status: 'sending',
        },
      ])

      const controller = new AbortController()
      abortRef.current = controller

      const activeToolsList = [...activeTools]
      if (webSearchEnabled && !activeToolsList.includes('web_search')) {
        activeToolsList.push('web_search')
      }
      const trigger = detectTriggers(txt)
      if (trigger.webSearch && !activeToolsList.includes('web_search')) {
        activeToolsList.push('web_search')
      }
      const finalThinkMode = trigger.thinking ? 'on' as ThinkMode : thinkMode
      const thinkParam = thinkModeToParam(finalThinkMode)

      try {
        await sendMessageStreamApi(
          activeChatId,
          txt,
          {
            signal: controller.signal,
            onEvent: (event) => {
              if (event.type === 'user_message') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.localKey === userLocalKey
                      ? { ...m, id: event.message_id }
                      : m
                  )
                )
                return
              }
              if (event.type === 'delta') {
                const delta = event.content ?? ''
                setMessages((prev) =>
                  prev.map((m) =>
                    m.localKey === aiLocalKey ? { ...m, text: m.text + delta } : m
                  )
                )
              } else if (event.type === 'thinking') {
                const thinkingDelta = event.thinking ?? ''
                setMessages((prev) =>
                  prev.map((m) =>
                    m.localKey === aiLocalKey
                      ? { ...m, thinking: (m.thinking ?? '') + thinkingDelta }
                      : m
                  )
                )
              } else if (event.type === 'web_search') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.localKey === aiLocalKey
                      ? { ...m, webSearchQuery: event.web_search_query }
                      : m
                  )
                )
              } else if (event.type === 'web_search_results') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.localKey === aiLocalKey
                      ? {
                          ...m,
                          webSearchResults: [
                            ...(m.webSearchResults ?? []),
                            ...(event.web_search_results ?? []),
                          ],
                        }
                      : m
                  )
                )
              } else if (event.type === 'title') {
                setChats((prev) =>
                  prev.map((c) => (c.id === activeChatId ? { ...c, title: event.title } : c))
                )
              } else if (event.type === 'done') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.localKey === aiLocalKey
                      ? { ...m, id: event.message_id ?? m.id, status: 'sent' }
                      : m
                  )
                )
              }
            },
          },
          activeToolsList,
          thinkParam
        )
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Stream failed', err)
          setMessages((prev) =>
            prev.map((m) =>
              m.localKey === aiLocalKey ? { ...m, status: 'error' } : m
            )
          )
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.localKey === aiLocalKey ? { ...m, status: 'sent' } : m
            )
          )
        }
      } finally {
        setIsGenerating(false)
        abortRef.current = null
        void refreshChats()
      }
    },
    [activeTools, currentView, isGenerating, currentChatId, refreshChats, setChats, thinkMode, webSearchEnabled, detectTriggers]
  )

  const editMessage = useCallback(
    async (messageId: string, newText: string) => {
      const trimmed = newText.trim()
      if (!trimmed || isGenerating || !currentChatId) return

      if (abortRef.current) {
        abortRef.current.abort()
        abortRef.current = null
      }

      const messageIndex = messages.findIndex((m) => m.id === messageId)
      if (messageIndex === -1) return
      const targetMessage = messages[messageIndex]
      if (targetMessage.type !== 'user') return

      setMessages((prev) => {
        const next = prev.slice(0, messageIndex + 1)
        next[messageIndex] = { ...targetMessage, text: trimmed }
        return next
      })

      setIsGenerating(true)

      const aiLocalKey = 'a-' + Date.now()
      setMessages((prev) => [
        ...prev,
        {
          id: aiLocalKey,
          localKey: aiLocalKey,
          type: 'ai',
          text: '',
          status: 'sending',
        },
      ])

      const controller = new AbortController()
      abortRef.current = controller

      const activeToolsList = [...activeTools]
      if (webSearchEnabled && !activeToolsList.includes('web_search')) {
        activeToolsList.push('web_search')
      }
      const trigger = detectTriggers(trimmed)
      if (trigger.webSearch && !activeToolsList.includes('web_search')) {
        activeToolsList.push('web_search')
      }
      const finalThinkMode = trigger.thinking ? 'on' as ThinkMode : thinkMode
      const thinkParam = thinkModeToParam(finalThinkMode)

      try {
        await editMessageStreamApi(
          currentChatId,
          messageId,
          trimmed,
          {
            signal: controller.signal,
            onEvent: (event) => {
              if (event.type === 'delta') {
                const delta = event.content ?? ''
                setMessages((prev) =>
                  prev.map((m) =>
                    m.localKey === aiLocalKey ? { ...m, text: m.text + delta } : m
                  )
                )
              } else if (event.type === 'thinking') {
                const thinkingDelta = event.thinking ?? ''
                setMessages((prev) =>
                  prev.map((m) =>
                    m.localKey === aiLocalKey
                      ? { ...m, thinking: (m.thinking ?? '') + thinkingDelta }
                      : m
                  )
                )
              } else if (event.type === 'web_search') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.localKey === aiLocalKey
                      ? { ...m, webSearchQuery: event.web_search_query }
                      : m
                  )
                )
              } else if (event.type === 'web_search_results') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.localKey === aiLocalKey
                      ? {
                          ...m,
                          webSearchResults: [
                            ...(m.webSearchResults ?? []),
                            ...(event.web_search_results ?? []),
                          ],
                        }
                      : m
                  )
                )
              } else if (event.type === 'done') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.localKey === aiLocalKey
                      ? { ...m, id: event.message_id ?? m.id, status: 'sent' }
                      : m
                  )
                )
              }
            },
          },
          activeToolsList,
          thinkParam
        )
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Edit stream failed', err)
          setMessages((prev) =>
            prev.map((m) =>
              m.localKey === aiLocalKey ? { ...m, status: 'error' } : m
            )
          )
        }
      } finally {
        setIsGenerating(false)
        abortRef.current = null
        void refreshChats()
      }
    },
    [activeTools, currentChatId, isGenerating, messages, refreshChats, thinkMode, webSearchEnabled, detectTriggers]
  )

  const regenerateMessage = useCallback(
    async (aiMessageId: string, userText: string) => {
      if (!userText.trim() || isGenerating || !currentChatId) return

      setMessages((prev) => prev.filter((m) => m.id !== aiMessageId))
      setIsGenerating(true)

      const newAiMessageId = 'a-' + Date.now()
      setMessages((prev) => [
        ...prev,
        {
          id: newAiMessageId,
          localKey: newAiMessageId,
          type: 'ai',
          text: '',
          status: 'sending',
        },
      ])

      const controller = new AbortController()
      abortRef.current = controller

      const activeToolsList = [...activeTools]
      if (webSearchEnabled && !activeToolsList.includes('web_search')) {
        activeToolsList.push('web_search')
      }
      const trigger = detectTriggers(userText)
      if (trigger.webSearch && !activeToolsList.includes('web_search')) {
        activeToolsList.push('web_search')
      }
      const finalThinkMode = trigger.thinking ? 'on' as ThinkMode : thinkMode
      const thinkParam = thinkModeToParam(finalThinkMode)

      try {
        await sendMessageStreamApi(
          currentChatId,
          userText,
          {
            signal: controller.signal,
            onEvent: (event) => {
              if (event.type === 'delta') {
                const delta = event.content ?? ''
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === newAiMessageId ? { ...m, text: m.text + delta } : m
                  )
                )
              } else if (event.type === 'thinking') {
                const thinkingDelta = event.thinking ?? ''
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === newAiMessageId
                      ? { ...m, thinking: (m.thinking ?? '') + thinkingDelta }
                      : m
                  )
                )
              } else if (event.type === 'web_search') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === newAiMessageId
                      ? { ...m, webSearchQuery: event.web_search_query }
                      : m
                  )
                )
              } else if (event.type === 'web_search_results') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === newAiMessageId
                      ? {
                          ...m,
                          webSearchResults: [
                            ...(m.webSearchResults ?? []),
                            ...(event.web_search_results ?? []),
                          ],
                        }
                      : m
                  )
                )
              } else if (event.type === 'done') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === newAiMessageId ? { ...m, status: 'sent' } : m
                  )
                )
              }
            },
          },
          activeToolsList,
          thinkParam
        )
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Regenerate failed', err)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === newAiMessageId ? { ...m, status: 'error' } : m
            )
          )
        }
      } finally {
        setIsGenerating(false)
        abortRef.current = null
        void refreshChats()
      }
    },
    [activeTools, currentChatId, isGenerating, refreshChats, thinkMode, webSearchEnabled, detectTriggers]
  )

  return {
    messages,
    setMessages,
    isGenerating,
    setIsGenerating,
    attachedFiles,
    setAttachedFiles,
    activeTools,
    setActiveTools,
    abortRef,
    openChat,
    startNewChat,
    startNotebookChat,
    startAgentChat,
    toggleTool,
    stopGeneration,
    attachFile,
    removeFile,
    sendMessage,
    editMessage,
    regenerateMessage,
  }
}
