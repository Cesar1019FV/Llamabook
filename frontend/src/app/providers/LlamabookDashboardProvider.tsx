import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { Message } from '@/entities/llamabook-message'
import type { Model } from '@/entities/llamabook-model'
import type { Notebook } from '@/entities/llamabook-notebook'
import { defaultModel } from '@/entities/llamabook-model'
import {
  initialNotebooks,
  newNotebookColors,
} from '@/widgets/llamabook-sidebar'
import { sampleMessages } from '@/widgets/llamabook-chat-view'
import { toolNames } from '@/widgets/llamabook-dock'

type View = 'dashboard' | 'chat' | 'notebooks-list' | 'notebook-detail'

interface DashboardState {
  sidebarOpen: boolean
  mobileSidebarOpen: boolean
  currentView: View
  currentChatId: string | null
  currentNotebookId: string | null
  messages: Message[]
  isGenerating: boolean
  attachedFiles: string[]
  activeTools: Set<string>
  expandedNotebooks: Set<string>
  plusPopupOpen: boolean
  modelPopupOpen: boolean
  profileDropdownOpen: boolean
  settingsModalOpen: boolean
  createNotebookModalOpen: boolean
  currentModel: Model
  searchQuery: string
  modelSearchQuery: string
  notebooks: Notebook[]
  i18n: ReturnType<typeof useTranslation>['i18n']
}

interface DashboardActions {
  toggleSidebar: () => void
  openMobileSidebar: () => void
  closeMobileSidebar: () => void
  showDashboard: () => void
  showNotebooksList: () => void
  showNotebookDetail: (id: string) => void
  openChat: (id: string | 'new') => void
  startNewChat: () => void
  sendMessage: (text: string) => void
  toggleTool: (tool: string) => void
  toggleNotebook: (id: string) => void
  collapseNotebook: (id: string) => void
  addNotebook: (name: string) => void
  attachFile: () => void
  removeFile: (name: string) => void
  selectModel: (model: Model) => void
  setSearchQuery: (q: string) => void
  setModelSearchQuery: (q: string) => void
  openPlusPopup: () => void
  closePlusPopup: () => void
  openModelPopup: () => void
  closeModelPopup: () => void
  openProfileDropdown: () => void
  closeProfileDropdown: () => void
  openSettingsModal: () => void
  closeSettingsModal: () => void
  openCreateNotebookModal: () => void
  closeCreateNotebookModal: () => void
  closePopups: () => void
  setAttachedFiles: React.Dispatch<React.SetStateAction<string[]>>
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>
}

interface DashboardContextValue extends DashboardState, DashboardActions {}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function LlamabookDashboardProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { t, i18n } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [currentNotebookId, setCurrentNotebookId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<string[]>([])
  const [activeTools, setActiveTools] = useState<Set<string>>(new Set())
  const [expandedNotebooks, setExpandedNotebooks] = useState<Set<string>>(
    new Set(['infra'])
  )
  const [plusPopupOpen, setPlusPopupOpen] = useState(false)
  const [modelPopupOpen, setModelPopupOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [createNotebookModalOpen, setCreateNotebookModalOpen] = useState(false)
  const [currentModel, setCurrentModel] = useState<Model>(defaultModel)
  const [searchQuery, setSearchQuery] = useState('')
  const [modelSearchQuery, setModelSearchQuery] = useState('')
  const [notebooks, setNotebooks] = useState<Notebook[]>(initialNotebooks)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const showDashboard = useCallback(() => {
    setCurrentView('dashboard')
    setCurrentChatId(null)
    setCurrentNotebookId(null)
  }, [])

  const showNotebooksList = useCallback(() => {
    setCurrentView('notebooks-list')
    setCurrentChatId(null)
    setCurrentNotebookId(null)
  }, [])

  const showNotebookDetail = useCallback((id: string) => {
    setCurrentView('notebook-detail')
    setCurrentNotebookId(id)
    setCurrentChatId(null)
  }, [])

  const openChat = useCallback(
    (id: string | 'new') => {
      const msgs = id === 'new' ? [] : sampleMessages.map((m) => ({ ...m }))
      setMessages(msgs)
      setCurrentView('chat')
      setCurrentChatId(id === 'new' ? null : id)
      setCurrentNotebookId(null)
      if (id === 'new') {
        setAttachedFiles([])
      }
      setTimeout(() => textareaRef.current?.focus(), 0)
    },
    [textareaRef]
  )

  const startNewChat = useCallback(() => {
    showDashboard()
  }, [showDashboard])

  const startNotebookChat = useCallback((notebookId: string) => {
    const msgs: Message[] = []
    setMessages(msgs)
    setCurrentView('chat')
    setCurrentChatId(null)
    setCurrentNotebookId(notebookId)
    setAttachedFiles([])
    setTimeout(() => textareaRef.current?.focus(), 0)
  }, [textareaRef])

  const sendMessage = useCallback(
    (text: string) => {
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
      setPlusPopupOpen(false)

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

      setTimeout(() => {
        setIsGenerating(false)
        const responses = [
          'Entendido. Déjame analizar tu consulta y proporcionar una respuesta fundamentada.',
          'Buena pregunta. Aquí va mi análisis:\n\n<strong>1.</strong> Considera el contexto.\n\n<strong>2.</strong> Evalúa los trade-offs.\n\n<strong>3.</strong> Implementa de forma incremental.',
          'La clave está en el balance entre consistencia, disponibilidad y latencia.',
        ]
        const responseText = responses[Math.floor(Math.random() * responses.length)]
        setMessages((prev) => [
          ...prev,
          { id: 'a-' + Date.now(), type: 'ai', text: responseText, time, status: 'sent' },
        ])
      }, 1600)
    },
    [activeTools, currentModel, currentView, i18n.language, isGenerating, t]
  )

  const toggleTool = useCallback((tool: string) => {
    setActiveTools((prev) => {
      const next = new Set(prev)
      if (next.has(tool)) next.delete(tool)
      else next.add(tool)
      return next
    })
  }, [])

  const toggleNotebook = useCallback((id: string) => {
    setExpandedNotebooks((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const collapseNotebook = useCallback((id: string) => {
    setExpandedNotebooks((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const addNotebook = useCallback((name: string) => {
    const id = 'cud_' + Date.now()
    const index = Math.floor(Math.random() * newNotebookColors.length)
    setNotebooks((prev) => [
      ...prev,
      {
        id,
        name: name.trim(),
        color: newNotebookColors[index],
        chats: [],
      }
    ])
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

  const selectModel = useCallback((model: Model) => {
    setCurrentModel(model)
    setModelPopupOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      sidebarOpen,
      mobileSidebarOpen,
      currentView,
      currentChatId,
      currentNotebookId,
      messages,
      isGenerating,
      attachedFiles,
      activeTools,
      expandedNotebooks,
      plusPopupOpen,
      modelPopupOpen,
      profileDropdownOpen,
      settingsModalOpen,
      createNotebookModalOpen,
      currentModel,
      searchQuery,
      modelSearchQuery,
      notebooks,
      i18n,
      toggleSidebar: () => setSidebarOpen((v) => !v),
      openMobileSidebar: () => setMobileSidebarOpen(true),
      closeMobileSidebar: () => setMobileSidebarOpen(false),
      showDashboard,
      showNotebooksList,
      showNotebookDetail,
      openChat,
      startNewChat,
      startNotebookChat,
      sendMessage,
      toggleTool,
      toggleNotebook,
      collapseNotebook,
      addNotebook,
      attachFile,
      removeFile,
      selectModel,
      setSearchQuery,
      setModelSearchQuery,
      openPlusPopup: () => setPlusPopupOpen(true),
      closePlusPopup: () => setPlusPopupOpen(false),
      openModelPopup: () => setModelPopupOpen(true),
      closeModelPopup: () => setModelPopupOpen(false),
      openProfileDropdown: () => setProfileDropdownOpen(true),
      closeProfileDropdown: () => setProfileDropdownOpen(false),
      openSettingsModal: () => {
        setProfileDropdownOpen(false)
        setSettingsModalOpen(true)
      },
      closeSettingsModal: () => setSettingsModalOpen(false),
      openCreateNotebookModal: () => setCreateNotebookModalOpen(true),
      closeCreateNotebookModal: () => setCreateNotebookModalOpen(false),
      closePopups: () => {
        setPlusPopupOpen(false)
        setModelPopupOpen(false)
        setProfileDropdownOpen(false)
      },
      setAttachedFiles,
      setIsGenerating,
    }),
    [
      sidebarOpen,
      mobileSidebarOpen,
      currentView,
      currentChatId,
      currentNotebookId,
      messages,
      isGenerating,
      attachedFiles,
      activeTools,
      expandedNotebooks,
      plusPopupOpen,
      modelPopupOpen,
      profileDropdownOpen,
      settingsModalOpen,
      createNotebookModalOpen,
      currentModel,
      searchQuery,
      modelSearchQuery,
      notebooks,
      i18n,
      showDashboard,
      showNotebooksList,
      showNotebookDetail,
      openChat,
      startNewChat,
      startNotebookChat,
      sendMessage,
      toggleTool,
      toggleNotebook,
      collapseNotebook,
      addNotebook,
      attachFile,
      removeFile,
      selectModel,
      setSearchQuery,
      setModelSearchQuery,
    ]
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (settingsModalOpen) {
          e.preventDefault()
          setSettingsModalOpen(false)
        } else if (createNotebookModalOpen) {
          e.preventDefault()
          setCreateNotebookModalOpen(false)
        } else if (profileDropdownOpen) {
          e.preventDefault()
          setProfileDropdownOpen(false)
        } else if (plusPopupOpen) {
          e.preventDefault()
          setPlusPopupOpen(false)
        } else if (modelPopupOpen) {
          e.preventDefault()
          setModelPopupOpen(false)
        } else if (currentView === 'chat') {
          showDashboard()
        }
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault()
        setSidebarOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [currentView, modelPopupOpen, plusPopupOpen, profileDropdownOpen, settingsModalOpen, createNotebookModalOpen, showDashboard])

  return (
    <DashboardContext.Provider value={value}>
      {children}
      <textarea ref={textareaRef} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
    </DashboardContext.Provider>
  )
}

export function useLlamabookDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) {
    throw new Error('useLlamabookDashboard must be used inside LlamabookDashboardProvider')
  }
  return ctx
}

export function useDashboardTextarea() {
  const { openChat } = useLlamabookDashboard()
  return { openChat }
}
