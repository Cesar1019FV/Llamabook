import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { Message } from '@/entities/llamabook-message'
import type { Model } from '@/entities/llamabook-model'
import type { Notebook } from '@/entities/llamabook-notebook'
import type { Agent } from '@/entities/llamabook-agent'
import type { PDFSource, PDFChat, GeneratedDocument } from '@/entities/llamabook-document'
import { defaultModel } from '@/entities/llamabook-model'
import {
  initialNotebooks,
  newNotebookColors,
  initialAgents,
  initialPDFSources,
  initialPDFChats,
  initialGeneratedDocs,
} from '@/widgets/llamabook-sidebar'
import { sampleMessages } from '@/widgets/llamabook-chat-view'
import { toolNames } from '@/widgets/llamabook-dock'

type View =
  | 'dashboard'
  | 'chat'
  | 'notebooks-list'
  | 'notebook-detail'
  | 'agents-list'
  | 'agent-detail'
  | 'pdf-chat-list'
  | 'pdf-chat-detail'
  | 'pdf-chat'
  | 'library'

interface DashboardState {
  sidebarOpen: boolean
  mobileSidebarOpen: boolean
  currentView: View
  currentChatId: string | null
  currentNotebookId: string | null
  currentAgentId: string | null
  currentPDFSourceId: string | null
  currentPDFChatId: string | null
  currentGeneratedDocId: string | null
  canvasOpen: boolean
  pdfPreviewOpen: boolean
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
  createAgentModalOpen: boolean
  uploadPDFModalOpen: boolean
  currentModel: Model
  searchQuery: string
  modelSearchQuery: string
  notebooks: Notebook[]
  agents: Agent[]
  pdfSources: PDFSource[]
  pdfChats: PDFChat[]
  generatedDocs: GeneratedDocument[]
  i18n: ReturnType<typeof useTranslation>['i18n']
}

interface DashboardActions {
  toggleSidebar: () => void
  openMobileSidebar: () => void
  closeMobileSidebar: () => void
  showDashboard: () => void
  showNotebooksList: () => void
  showNotebookDetail: (id: string) => void
  showAgentsList: () => void
  showAgentDetail: (id: string) => void
  showPDFChatList: () => void
  showPDFChatDetail: (id: string) => void
  showPDFChat: (id: string) => void
  showLibrary: () => void
  openChat: (id: string | 'new') => void
  startNewChat: () => void
  startNotebookChat: (notebookId: string) => void
  startAgentChat: (agentId: string) => void
  startPDFChat: (sourceId: string) => void
  openPDFChat: (chatId: string) => void
  uploadPDF: (files: File[]) => void
  sendMessage: (text: string) => void
  toggleTool: (tool: string) => void
  toggleNotebook: (id: string) => void
  collapseNotebook: (id: string) => void
  addNotebook: (name: string) => void
  updateNotebookContext: (id: string, context: string) => void
  addAgent: (agent: Omit<Agent, 'id'>) => void
  openCanvas: (docId?: string) => void
  closeCanvas: () => void
  togglePDFPreview: () => void
  openPDFPreview: () => void
  closePDFPreview: () => void
  updateGeneratedDoc: (id: string, content: string) => void
  updateGeneratedDocTitle: (id: string, title: string) => void
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
  openCreateAgentModal: () => void
  closeCreateAgentModal: () => void
  openUploadPDFModal: () => void
  closeUploadPDFModal: () => void
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
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null)
  const [currentPDFSourceId, setCurrentPDFSourceId] = useState<string | null>(null)
  const [currentPDFChatId, setCurrentPDFChatId] = useState<string | null>(null)
  const [currentGeneratedDocId, setCurrentGeneratedDocId] = useState<string | null>(null)
  const [canvasOpen, setCanvasOpen] = useState(false)
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(true)
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
  const [createAgentModalOpen, setCreateAgentModalOpen] = useState(false)
  const [uploadPDFModalOpen, setUploadPDFModalOpen] = useState(false)
  const [currentModel, setCurrentModel] = useState<Model>(defaultModel)
  const [searchQuery, setSearchQuery] = useState('')
  const [modelSearchQuery, setModelSearchQuery] = useState('')
  const [notebooks, setNotebooks] = useState<Notebook[]>(initialNotebooks)
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [pdfSources, setPdfSources] = useState<PDFSource[]>(initialPDFSources)
  const [pdfChats, setPdfChats] = useState<PDFChat[]>(initialPDFChats)
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocument[]>(initialGeneratedDocs)

  const showDashboard = useCallback(() => {
    setCurrentView('dashboard')
    setCurrentChatId(null)
    setCurrentNotebookId(null)
    setCurrentAgentId(null)
    setCurrentPDFSourceId(null)
    setCurrentPDFChatId(null)
    setCurrentGeneratedDocId(null)
    setCanvasOpen(false)
    setPdfPreviewOpen(true)
  }, [])

  const showNotebooksList = useCallback(() => {
    setCurrentView('notebooks-list')
    setCurrentChatId(null)
    setCurrentNotebookId(null)
    setCurrentAgentId(null)
    setCurrentPDFSourceId(null)
    setCurrentPDFChatId(null)
    setCurrentGeneratedDocId(null)
    setCanvasOpen(false)
    setPdfPreviewOpen(true)
  }, [])

  const showNotebookDetail = useCallback((id: string) => {
    setCurrentView('notebook-detail')
    setCurrentNotebookId(id)
    setCurrentChatId(null)
    setCurrentAgentId(null)
    setCurrentPDFSourceId(null)
    setCurrentPDFChatId(null)
    setCurrentGeneratedDocId(null)
    setCanvasOpen(false)
    setPdfPreviewOpen(true)
  }, [])

  const showAgentsList = useCallback(() => {
    setCurrentView('agents-list')
    setCurrentChatId(null)
    setCurrentNotebookId(null)
    setCurrentAgentId(null)
    setCurrentPDFSourceId(null)
    setCurrentPDFChatId(null)
    setCurrentGeneratedDocId(null)
    setCanvasOpen(false)
    setPdfPreviewOpen(true)
  }, [])

  const showAgentDetail = useCallback((id: string) => {
    setCurrentView('agent-detail')
    setCurrentAgentId(id)
    setCurrentChatId(null)
    setCurrentNotebookId(null)
    setCurrentPDFSourceId(null)
    setCurrentPDFChatId(null)
    setCurrentGeneratedDocId(null)
    setCanvasOpen(false)
    setPdfPreviewOpen(true)
  }, [])

  const showPDFChatList = useCallback(() => {
    setCurrentView('pdf-chat-list')
    setCurrentChatId(null)
    setCurrentNotebookId(null)
    setCurrentAgentId(null)
    setCurrentPDFSourceId(null)
    setCurrentPDFChatId(null)
    setCurrentGeneratedDocId(null)
    setCanvasOpen(false)
    setPdfPreviewOpen(true)
  }, [])

  const showPDFChatDetail = useCallback((id: string) => {
    setCurrentView('pdf-chat-detail')
    setCurrentPDFSourceId(id)
    setCurrentChatId(null)
    setCurrentNotebookId(null)
    setCurrentAgentId(null)
    setCurrentPDFChatId(null)
    setCurrentGeneratedDocId(null)
    setCanvasOpen(false)
    setPdfPreviewOpen(true)
  }, [])

  const showPDFChat = useCallback((id: string) => {
    const chat = pdfChats.find((c) => c.id === id)
    if (!chat) return
    setCurrentView('pdf-chat')
    setCurrentPDFChatId(id)
    setCurrentPDFSourceId(chat.sourceId)
    setCurrentChatId(null)
    setCurrentNotebookId(null)
    setCurrentAgentId(null)
    setCurrentGeneratedDocId(null)
    setMessages(chat.messages.map((m) => ({ ...m })))
    setCanvasOpen(false)
    setPdfPreviewOpen(true)
    setSidebarOpen(false)
  }, [pdfChats])

  const showLibrary = useCallback(() => {
    setCurrentView('library')
    setCurrentChatId(null)
    setCurrentNotebookId(null)
    setCurrentAgentId(null)
    setCurrentPDFSourceId(null)
    setCurrentPDFChatId(null)
    setCurrentGeneratedDocId(null)
    setCanvasOpen(false)
    setPdfPreviewOpen(true)
  }, [])

  const openChat = useCallback(
    (id: string | 'new') => {
      const msgs = id === 'new' ? [] : sampleMessages.map((m) => ({ ...m }))
      setMessages(msgs)
      setCurrentView('chat')
      setCurrentChatId(id === 'new' ? null : id)
      setCurrentNotebookId(null)
      setCurrentAgentId(null)
      setCurrentPDFSourceId(null)
      setCurrentPDFChatId(null)
      setCurrentGeneratedDocId(null)
      setCanvasOpen(false)
      setPdfPreviewOpen(true)
      if (id === 'new') {
        setAttachedFiles([])
      }
    },
    []
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
    setCurrentAgentId(null)
    setCurrentPDFSourceId(null)
    setCurrentPDFChatId(null)
    setCurrentGeneratedDocId(null)
    setCanvasOpen(false)
    setPdfPreviewOpen(true)
    setAttachedFiles([])
  }, [])

  const startAgentChat = useCallback((agentId: string) => {
    const msgs: Message[] = []
    setMessages(msgs)
    setCurrentView('chat')
    setCurrentChatId(null)
    setCurrentNotebookId(null)
    setCurrentAgentId(agentId)
    setCurrentPDFSourceId(null)
    setCurrentPDFChatId(null)
    setCurrentGeneratedDocId(null)
    setCanvasOpen(false)
    setPdfPreviewOpen(true)
    setAttachedFiles([])
  }, [])

  const startPDFChat = useCallback(
    (sourceId: string) => {
      const id = 'pch_' + Date.now()
      const source = pdfSources.find((s) => s.id === sourceId)
      const title = source ? `Chat sobre ${source.name.replace(/\.pdf$/i, '')}` : 'Chat PDF'
      const chat: PDFChat = {
        id,
        sourceId,
        title,
        createdAt: Date.now(),
        messages: [],
      }
      setPdfChats((prev) => [chat, ...prev])
      setMessages([])
      setCurrentView('pdf-chat')
      setCurrentChatId(null)
      setCurrentNotebookId(null)
      setCurrentAgentId(null)
      setCurrentPDFSourceId(sourceId)
      setCurrentPDFChatId(id)
      setCurrentGeneratedDocId(null)
      setCanvasOpen(false)
      setPdfPreviewOpen(true)
      setAttachedFiles([])
      setSidebarOpen(false)
    },
    [pdfSources]
  )

  const openPDFChat = useCallback(
    (chatId: string) => {
      const chat = pdfChats.find((c) => c.id === chatId)
      if (!chat) return
      setCurrentView('pdf-chat')
      setCurrentPDFChatId(chatId)
      setCurrentPDFSourceId(chat.sourceId)
      setCurrentChatId(null)
      setCurrentNotebookId(null)
      setCurrentAgentId(null)
      setCurrentGeneratedDocId(null)
      setMessages(chat.messages.map((m) => ({ ...m })))
      setCanvasOpen(false)
      setPdfPreviewOpen(true)
      setAttachedFiles([])
      setSidebarOpen(false)
    },
    [pdfChats]
  )

  const uploadPDF = useCallback((files: File[]) => {
    const validFiles = files.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    )
    if (validFiles.length === 0) return

    const first = validFiles[0]
    const id = 'pdf_' + Date.now()
    const totalBytes = validFiles.reduce((sum, f) => sum + f.size, 0)
    const size =
      totalBytes > 1024 * 1024
        ? `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`
        : `${(totalBytes / 1024).toFixed(0)} KB`
    const index = Math.floor(Math.random() * newNotebookColors.length)
    const name =
      validFiles.length === 1
        ? first.name
        : `${first.name.replace(/\.pdf$/i, '')} y ${validFiles.length - 1} mas.pdf`

    const url = URL.createObjectURL(first)
    const source: PDFSource = {
      id,
      name,
      size,
      pages: 0,
      color: newNotebookColors[index],
      createdAt: Date.now(),
      file: first,
      url,
    }
    setPdfSources((prev) => [source, ...prev])
    showPDFChatDetail(id)
  }, [])

  const openCanvas = useCallback(
    (docId?: string) => {
      if (docId) {
        setCurrentGeneratedDocId(docId)
      } else {
        const source = currentPDFSourceId
          ? pdfSources.find((s) => s.id === currentPDFSourceId)
          : undefined
        const chat = currentPDFChatId ? pdfChats.find((c) => c.id === currentPDFChatId) : undefined
        const title = source
          ? `Documento sobre ${source.name.replace(/\.pdf$/i, '')}`
          : 'Documento sin titulo'
        const id = 'doc_' + Date.now()
        const doc: GeneratedDocument = {
          id,
          title,
          content: '',
          sourceId: currentPDFSourceId ?? undefined,
          chatId: chat?.id,
          type: 'draft',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        setGeneratedDocs((prev) => [doc, ...prev])
        setCurrentGeneratedDocId(id)
      }
      setCanvasOpen(true)
      setSidebarOpen(false)
      setPdfPreviewOpen(false)
    },
    [currentPDFSourceId, currentPDFChatId, pdfSources, pdfChats]
  )

  const closeCanvas = useCallback(() => {
    setCanvasOpen(false)
    setSidebarOpen(true)
    if (currentPDFChatId) {
      setPdfPreviewOpen(true)
      setCurrentView('pdf-chat')
      setCurrentGeneratedDocId(null)
    } else if (currentPDFSourceId) {
      setPdfPreviewOpen(true)
      setCurrentView('pdf-chat-detail')
      setCurrentGeneratedDocId(null)
    } else {
      setCurrentGeneratedDocId(null)
    }
  }, [currentPDFChatId, currentPDFSourceId])

  const togglePDFPreview = useCallback(() => {
    setPdfPreviewOpen((v) => !v)
  }, [])

  const openPDFPreview = useCallback(() => {
    setPdfPreviewOpen(true)
  }, [])

  const closePDFPreview = useCallback(() => {
    setPdfPreviewOpen(false)
  }, [])

  const updateGeneratedDoc = useCallback((id: string, content: string) => {
    setGeneratedDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, content, updatedAt: Date.now() } : d))
    )
  }, [])

  const updateGeneratedDocTitle = useCallback((id: string, title: string) => {
    setGeneratedDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, title, updatedAt: Date.now() } : d))
    )
  }, [])

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
        const responses = currentPDFSourceId
          ? [
              'He revisado el PDF. Basandome en el contenido, aqui va un analisis clave:\n\n<strong>1.</strong> El documento establece un marco conceptual solido.\n\n<strong>2.</strong> Se identifican tres trade-offs principales.\n\n<strong>3.</strong> Recomiendo profundizar en la seccion de implementacion.',
              'Segun el PDF, la recomendacion principal es adoptar un enfoque incremental. Puedo ayudarte a redactar un documento con esta estructura si lo deseas.',
            ]
          : [
              'Entendido. Dejame analizar tu consulta y proporcionar una respuesta fundamentada.',
              'Buena pregunta. Aqui va mi analisis:\n\n<strong>1.</strong> Considera el contexto.\n\n<strong>2.</strong> Evalua los trade-offs.\n\n<strong>3.</strong> Implementa de forma incremental.',
              'La clave esta en el balance entre consistencia, disponibilidad y latencia.',
            ]
        const responseText = responses[Math.floor(Math.random() * responses.length)]
        const aiMessage: Message = {
          id: 'a-' + Date.now(),
          type: 'ai',
          text: responseText,
          time,
          status: 'sent',
        }
        setMessages((prev) => [...prev, aiMessage])

        if (currentPDFChatId) {
          setPdfChats((prev) =>
            prev.map((c) =>
              c.id === currentPDFChatId
                ? {
                    ...c,
                    messages: [
                      ...c.messages,
                      { id: 'u-' + Date.now(), type: 'user', text: txt, time, status: 'sent' },
                      aiMessage,
                    ],
                  }
                : c
            )
          )
        }

        if (currentPDFSourceId && canvasOpen && currentGeneratedDocId) {
          const draftParagraph = responseText.replace(/<\/?strong>/g, '').replace(/\n\n/g, '\n')
          updateGeneratedDoc(currentGeneratedDocId, `<p>${draftParagraph}</p>`)
        }
      }, 1600)
    },
    [activeTools, currentModel, currentView, i18n.language, isGenerating, t, currentPDFSourceId, currentPDFChatId, canvasOpen, currentGeneratedDocId, updateGeneratedDoc]
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
        context: '',
      },
    ])
  }, [])

  const updateNotebookContext = useCallback((id: string, context: string) => {
    setNotebooks((prev) =>
      prev.map((n) => (n.id === id ? { ...n, context: context.trim() } : n))
    )
  }, [])

  const addAgent = useCallback((agent: Omit<Agent, 'id'>) => {
    const id = 'agt_' + Date.now()
    setAgents((prev) => [
      ...prev,
      {
        id,
        name: agent.name.trim(),
        description: agent.description.trim(),
        avatar: agent.avatar,
        color: agent.color,
        context: agent.context.trim(),
      },
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
      currentAgentId,
      currentPDFSourceId,
      currentPDFChatId,
      currentGeneratedDocId,
      canvasOpen,
      pdfPreviewOpen,
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
      createAgentModalOpen,
      uploadPDFModalOpen,
      currentModel,
      searchQuery,
      modelSearchQuery,
      notebooks,
      agents,
      pdfSources,
      pdfChats,
      generatedDocs,
      i18n,
      toggleSidebar: () => setSidebarOpen((v) => !v),
      openMobileSidebar: () => setMobileSidebarOpen(true),
      closeMobileSidebar: () => setMobileSidebarOpen(false),
      showDashboard,
      showNotebooksList,
      showNotebookDetail,
      showAgentsList,
      showAgentDetail,
      showPDFChatList,
      showPDFChatDetail,
      showPDFChat,
      showLibrary,
      openChat,
      startNewChat,
      startNotebookChat,
      startAgentChat,
      startPDFChat,
      openPDFChat,
      uploadPDF,
      sendMessage,
      toggleTool,
      toggleNotebook,
      collapseNotebook,
      addNotebook,
      updateNotebookContext,
      addAgent,
      openCanvas,
      closeCanvas,
      togglePDFPreview,
      openPDFPreview,
      closePDFPreview,
      updateGeneratedDoc,
      updateGeneratedDocTitle,
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
      openCreateAgentModal: () => setCreateAgentModalOpen(true),
      closeCreateAgentModal: () => setCreateAgentModalOpen(false),
      openUploadPDFModal: () => setUploadPDFModalOpen(true),
      closeUploadPDFModal: () => setUploadPDFModalOpen(false),
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
      currentAgentId,
      currentPDFSourceId,
      currentPDFChatId,
      currentGeneratedDocId,
      canvasOpen,
      pdfPreviewOpen,
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
      createAgentModalOpen,
      uploadPDFModalOpen,
      currentModel,
      searchQuery,
      modelSearchQuery,
      notebooks,
      agents,
      pdfSources,
      pdfChats,
      generatedDocs,
      i18n,
      showDashboard,
      showNotebooksList,
      showNotebookDetail,
      showAgentsList,
      showAgentDetail,
      showPDFChatList,
      showPDFChatDetail,
      showPDFChat,
      showLibrary,
      openChat,
      startNewChat,
      startNotebookChat,
      startAgentChat,
      startPDFChat,
      openPDFChat,
      uploadPDF,
      sendMessage,
      toggleTool,
      toggleNotebook,
      collapseNotebook,
      addNotebook,
      updateNotebookContext,
      addAgent,
      openCanvas,
      closeCanvas,
      togglePDFPreview,
      openPDFPreview,
      closePDFPreview,
      updateGeneratedDoc,
      updateGeneratedDocTitle,
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
        } else if (createAgentModalOpen) {
          e.preventDefault()
          setCreateAgentModalOpen(false)
        } else if (uploadPDFModalOpen) {
          e.preventDefault()
          setUploadPDFModalOpen(false)
        } else if (profileDropdownOpen) {
          e.preventDefault()
          setProfileDropdownOpen(false)
        } else if (plusPopupOpen) {
          e.preventDefault()
          setPlusPopupOpen(false)
        } else if (modelPopupOpen) {
          e.preventDefault()
          setModelPopupOpen(false)
        } else if (canvasOpen) {
          e.preventDefault()
          closeCanvas()
        } else if (currentView === 'chat') {
          showDashboard()
        } else if (currentView === 'pdf-chat') {
          if (currentPDFSourceId) {
            showPDFChatDetail(currentPDFSourceId)
          } else {
            showPDFChatList()
          }
        }
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault()
        setSidebarOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [currentView, modelPopupOpen, plusPopupOpen, profileDropdownOpen, settingsModalOpen, createNotebookModalOpen, createAgentModalOpen, uploadPDFModalOpen, canvasOpen, closeCanvas, showDashboard, currentPDFSourceId])

  return (
    <DashboardContext.Provider value={value}>
      {children}
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
