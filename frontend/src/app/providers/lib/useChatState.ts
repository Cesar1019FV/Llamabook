import {
  useState,
  useCallback,
  useRef,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { Message } from '@/entities/llamabook-message'
import type { Chat } from '@/entities/llamabook-chat'
import { toolNames } from '@/widgets/llamabook-dock'
import type { Model } from '@/entities/llamabook-model'
import {
  createChatApi,
  listMessagesApi,
  sendMessageStreamApi,
  mapBackendMessages,
} from '@/features/chat'
import type { View } from '../model/types'

interface UseChatStateProps {
  currentView: View
  currentModel: Model
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
}

export function useChatState({
  currentView,
  currentModel,
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
}: UseChatStateProps) {
  const { t, i18n } = useTranslation()
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

      setMessages((prev) => {
        const next = [...prev]
        if (next.length === 0) {
          const activeToolNames = [...activeTools]
            .map((id) => toolNames[i18n.language]?.[id] || toolNames.es[id])
            .filter(Boolean)
            .join(', ')
          const systemText = activeToolNames
            ? t('dashboard.chatView.conversationStartedWithTools', {
                model: currentModel.name,
                tools: activeToolNames,
              })
            : t('dashboard.chatView.conversationStarted', {
                model: currentModel.name,
              })
          next.push({ id: 'sys-' + Date.now(), type: 'system', text: systemText })
        }
        next.push({ id: 'u-' + Date.now(), type: 'user', text: txt, time, status: 'sent' })
        return next
      })

      setAttachedFiles([])
      setIsGenerating(true)

      const aiMessageId = 'a-' + Date.now()
      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          type: 'ai',
          text: '',
          time,
          status: 'sending',
        },
      ])

      const controller = new AbortController()
      abortRef.current = controller

      const activeToolsList = [...activeTools]

      try {
        await sendMessageStreamApi(
          activeChatId,
          txt,
          {
            signal: controller.signal,
            onEvent: (event) => {
              if (event.type === 'delta') {
                const delta = event.content ?? ''
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMessageId ? { ...m, text: m.text + delta } : m
                  )
                )
              } else if (event.type === 'thinking') {
                const thinkingDelta = event.thinking ?? ''
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMessageId
                      ? { ...m, thinking: (m.thinking ?? '') + thinkingDelta }
                      : m
                  )
                )
              } else if (event.type === 'web_search') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMessageId
                      ? { ...m, webSearchQuery: event.web_search_query }
                      : m
                  )
                )
              } else if (event.type === 'web_search_results') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMessageId
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
                    m.id === aiMessageId ? { ...m, status: 'sent' } : m
                  )
                )
              }
            },
          },
          activeToolsList
        )
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Stream failed', err)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMessageId ? { ...m, status: 'error' } : m
            )
          )
        }
      } finally {
        setIsGenerating(false)
        abortRef.current = null
        void refreshChats()
      }
    },
    [activeTools, currentModel, currentView, i18n.language, isGenerating, t, currentChatId, refreshChats, setChats]
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
          type: 'ai',
          text: '',
          status: 'sending',
        },
      ])

      const controller = new AbortController()
      abortRef.current = controller

      const activeToolsList = [...activeTools]

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
          activeToolsList
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
    [activeTools, currentChatId, isGenerating, refreshChats]
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
    attachFile,
    removeFile,
    sendMessage,
    regenerateMessage,
  }
}
