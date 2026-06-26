import { createContext, useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { defaultModel, availableModels } from '@/entities/llamabook-model'
import { useState } from 'react'
import type { Model } from '@/entities/llamabook-model'
import type { DashboardContextValue } from './model/types'
import { http } from '@/shared/api'
import { useSidebar } from './lib/useSidebar'
import { useNavigation } from './lib/useNavigation'
import { useChatState } from './lib/useChatState'
import { useChatList } from './lib/useChatList'
import { useNotebooks } from './lib/useNotebooks'
import { useAgents } from './lib/useAgents'
import { usePDFState } from './lib/usePDFState'
import { useGeneratedDocs } from './lib/useGeneratedDocs'
import { useModals } from './lib/useModals'
import { useSpinnerVariant } from './lib/useSpinnerVariant'
import { useThinkMode } from './lib/useThinkMode'
import { useWebSearchEnabled } from './lib/useWebSearchEnabled'
import { useTriggers } from './lib/useTriggers'
import { useMemoryBuffer } from './lib/useMemoryBuffer'
import { useKeyboardShortcuts } from './lib/useKeyboardShortcuts'
import { useAuth } from '@/features/auth'

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function LlamabookDashboardProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [modelSearchQuery, setModelSearchQuery] = useState('')
  const [currentModel, setCurrentModel] = useState<Model>(defaultModel)

  useEffect(() => {
    http.get<{ id: string }>('/models/default')
      .then((res) => {
        const found = availableModels.find((m) => m.id === res.id)
        if (found) {
          setCurrentModel(found)
        } else {
          setCurrentModel({
            id: res.id,
            name: res.id,
            desc: 'Modelo de Ollama',
            provider: 'local' as const,
            gradient: 'linear-gradient(135deg,#c96442,#d97757)',
            dotColor: '#d97757',
          })
        }
      })
      .catch(() => {
        // keep default
      })
  }, [])

  const { i18n } = useTranslation()
  const { setUser } = useAuth()

  const {
    sidebarOpen,
    mobileSidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    openMobileSidebar,
    closeMobileSidebar,
  } = useSidebar()

  const navigation = useNavigation({
    setSidebarOpen,
  })

  const [pdfPreviewOpenState, setPdfPreviewOpenState] = useState(true)
  const togglePDFPreview = () => setPdfPreviewOpenState((v) => !v)
  const openPDFPreview = () => setPdfPreviewOpenState(true)
  const closePDFPreview = () => setPdfPreviewOpenState(false)

  const chatList = useChatList({
    currentChatId: navigation.currentChatId,
    showDashboard: navigation.showDashboard,
  })

  const modals = useModals()
  const spinner = useSpinnerVariant()
  const think = useThinkMode()
  const webSearch = useWebSearchEnabled()
  const triggers = useTriggers()
  const memoryBuffer = useMemoryBuffer()

  const chatState = useChatState({
    currentView: navigation.currentView,
    setCurrentView: navigation.setCurrentView,
    currentChatId: navigation.currentChatId,
    setCurrentChatId: navigation.setCurrentChatId,
    setCurrentNotebookId: navigation.setCurrentNotebookId,
    setCurrentAgentId: navigation.setCurrentAgentId,
    setCurrentPDFSourceId: navigation.setCurrentPDFSourceId,
    setCurrentPDFChatId: navigation.setCurrentPDFChatId,
    setCurrentGeneratedDocId: navigation.setCurrentGeneratedDocId,
    setCanvasOpen: navigation.setCanvasOpen,
    setSidebarOpen,
    setChats: chatList.setChats,
    refreshChats: chatList.refreshChats,
    thinkMode: think.thinkMode,
    webSearchEnabled: webSearch.webSearchEnabled,
    detectTriggers: triggers.detectTriggers,
    addMemoryMessage: memoryBuffer.addMemoryMessage,
    memoryMessages: memoryBuffer.memoryMessages,
    clearMemoryBuffer: memoryBuffer.clearMemoryBuffer,
    currentModel: currentModel.id,
    onMemoryExtracted: (user) => setUser(user),
  })
  const notebooks = useNotebooks()
  const agents = useAgents()

  const pdfState = usePDFState({
    setCurrentView: navigation.setCurrentView,
    setCurrentPDFChatId: navigation.setCurrentPDFChatId,
    setCurrentPDFSourceId: navigation.setCurrentPDFSourceId,
    setCurrentChatId: navigation.setCurrentChatId,
    setCurrentNotebookId: navigation.setCurrentNotebookId,
    setCurrentAgentId: navigation.setCurrentAgentId,
    setCurrentGeneratedDocId: navigation.setCurrentGeneratedDocId,
    setMessages: chatState.setMessages,
    setAttachedFiles: chatState.setAttachedFiles,
    setSidebarOpen,
    showPDFChatDetail: navigation.showPDFChatDetail,
  })

  const generatedDocs = useGeneratedDocs({
    pdfSources: pdfState.pdfSources,
    pdfChats: pdfState.pdfChats,
    currentPDFSourceId: navigation.currentPDFSourceId,
    currentPDFChatId: navigation.currentPDFChatId,
    setCurrentGeneratedDocId: navigation.setCurrentGeneratedDocId,
    setCanvasOpen: navigation.setCanvasOpen,
    setSidebarOpen,
    setPdfPreviewOpen: setPdfPreviewOpenState,
    setCurrentView: navigation.setCurrentView,
  })

  useKeyboardShortcuts({
    currentView: navigation.currentView,
    modelPopupOpen: modals.modelPopupOpen,
    plusPopupOpen: modals.plusPopupOpen,
    profileDropdownOpen: modals.profileDropdownOpen,
    settingsModalOpen: modals.settingsModalOpen,
    createNotebookModalOpen: modals.createNotebookModalOpen,
    createAgentModalOpen: modals.createAgentModalOpen,
    uploadPDFModalOpen: modals.uploadPDFModalOpen,
    canvasOpen: navigation.canvasOpen,
    currentPDFSourceId: navigation.currentPDFSourceId,
    setSettingsModalOpen: (v) => v ? modals.openSettingsModal() : modals.closeSettingsModal(),
    setCreateNotebookModalOpen: (v) =>
      v ? modals.openCreateNotebookModal() : modals.closeCreateNotebookModal(),
    setCreateAgentModalOpen: (v) =>
      v ? modals.openCreateAgentModal() : modals.closeCreateAgentModal(),
    setUploadPDFModalOpen: (v) =>
      v ? modals.openUploadPDFModal() : modals.closeUploadPDFModal(),
    setProfileDropdownOpen: (v) =>
      v ? modals.openProfileDropdown() : modals.closeProfileDropdown(),
    setPlusPopupOpen: (v) => (v ? modals.openPlusPopup() : modals.closePlusPopup()),
    setModelPopupOpen: (v) => (v ? modals.openModelPopup() : modals.closeModelPopup()),
    closeCanvas: generatedDocs.closeCanvas,
    showDashboard: navigation.showDashboard,
    showPDFChatDetail: navigation.showPDFChatDetail,
    showPDFChatList: navigation.showPDFChatList,
    setSidebarOpen,
  })

  const selectModel = (model: Model) => {
    setCurrentModel(model)
    modals.closeModelPopup()
  }

  const value = useMemo<DashboardContextValue>(
    () => ({
      sidebarOpen,
      mobileSidebarOpen,
      currentView: navigation.currentView,
      currentChatId: navigation.currentChatId,
      currentNotebookId: navigation.currentNotebookId,
      currentAgentId: navigation.currentAgentId,
      currentPDFSourceId: navigation.currentPDFSourceId,
      currentPDFChatId: navigation.currentPDFChatId,
      currentGeneratedDocId: navigation.currentGeneratedDocId,
      canvasOpen: navigation.canvasOpen,
      pdfPreviewOpen: pdfPreviewOpenState,
      messages: chatState.messages,
      isGenerating: chatState.isGenerating,
      attachedFiles: chatState.attachedFiles,
      pendingImages: chatState.pendingImages,
      activeTools: chatState.activeTools,
      expandedNotebooks: notebooks.expandedNotebooks,
      plusPopupOpen: modals.plusPopupOpen,
      modelPopupOpen: modals.modelPopupOpen,
      profileDropdownOpen: modals.profileDropdownOpen,
      settingsModalOpen: modals.settingsModalOpen,
      createNotebookModalOpen: modals.createNotebookModalOpen,
      createAgentModalOpen: modals.createAgentModalOpen,
      uploadPDFModalOpen: modals.uploadPDFModalOpen,
      currentModel,
      searchQuery,
      modelSearchQuery,
      notebooks: notebooks.notebooks,
      agents: agents.agents,
      pdfSources: pdfState.pdfSources,
      pdfChats: pdfState.pdfChats,
      generatedDocs: generatedDocs.generatedDocs,
      chats: chatList.chats,
      spinnerVariant: spinner.spinnerVariant,
      thinkMode: think.thinkMode,
      lastEffort: think.lastEffort,
      webSearchEnabled: webSearch.webSearchEnabled,
      triggerSettings: triggers.settings,
      memoryCount: memoryBuffer.memoryCount,
      i18n,
      toggleSidebar,
      openMobileSidebar,
      closeMobileSidebar,
      showDashboard: navigation.showDashboard,
      showNotebooksList: navigation.showNotebooksList,
      showNotebookDetail: navigation.showNotebookDetail,
      showAgentsList: navigation.showAgentsList,
      showAgentDetail: navigation.showAgentDetail,
      showPDFChatList: navigation.showPDFChatList,
      showPDFChatDetail: navigation.showPDFChatDetail,
      showPDFChat: pdfState.showPDFChat,
      showLibrary: navigation.showLibrary,
      openChat: chatState.openChat,
      startNewChat: chatState.startNewChat,
      startNotebookChat: chatState.startNotebookChat,
      startAgentChat: chatState.startAgentChat,
      startPDFChat: pdfState.startPDFChat,
      openPDFChat: pdfState.openPDFChat,
      uploadPDF: pdfState.uploadPDF,
      sendMessage: chatState.sendMessage,
      editMessage: chatState.editMessage,
      regenerateMessage: chatState.regenerateMessage,
      refreshChats: chatList.refreshChats,
      pinChat: chatList.pinChat,
      renameChat: chatList.renameChat,
      deleteChat: chatList.deleteChat,
      toggleTool: chatState.toggleTool,
      stopGeneration: chatState.stopGeneration,
      toggleNotebook: notebooks.toggleNotebook,
      collapseNotebook: notebooks.collapseNotebook,
      addNotebook: notebooks.addNotebook,
      updateNotebookContext: notebooks.updateNotebookContext,
      addAgent: agents.addAgent,
      openCanvas: generatedDocs.openCanvas,
      closeCanvas: generatedDocs.closeCanvas,
      togglePDFPreview,
      openPDFPreview,
      closePDFPreview,
      updateGeneratedDoc: generatedDocs.updateGeneratedDoc,
      updateGeneratedDocTitle: generatedDocs.updateGeneratedDocTitle,
      attachFile: chatState.attachFile,
      removeFile: chatState.removeFile,
      addPendingImage: chatState.addPendingImage,
      removePendingImage: chatState.removePendingImage,
      selectModel,
      setSearchQuery,
      setModelSearchQuery,
      setSpinnerVariant: spinner.setSpinnerVariant,
      setThinkMode: think.setThinkMode,
      setWebSearchEnabled: webSearch.setWebSearchEnabled,
      detectTriggers: triggers.detectTriggers,
      addTriggerKeyword: (group, kw) => {
        if (group === 'webSearch') triggers.addWebSearchKeyword(kw)
        else triggers.addThinkingKeyword(kw)
      },
      removeTriggerKeyword: (group, kw) => {
        if (group === 'webSearch') triggers.removeWebSearchKeyword(kw)
        else triggers.removeThinkingKeyword(kw)
      },
      toggleTriggersEnabled: triggers.toggleEnabled,
      clearMemoryBuffer: memoryBuffer.clearMemoryBuffer,
      openPlusPopup: modals.openPlusPopup,
      closePlusPopup: modals.closePlusPopup,
      openModelPopup: modals.openModelPopup,
      closeModelPopup: modals.closeModelPopup,
      openProfileDropdown: modals.openProfileDropdown,
      closeProfileDropdown: modals.closeProfileDropdown,
      openSettingsModal: modals.openSettingsModal,
      closeSettingsModal: modals.closeSettingsModal,
      openCreateNotebookModal: modals.openCreateNotebookModal,
      closeCreateNotebookModal: modals.closeCreateNotebookModal,
      openCreateAgentModal: modals.openCreateAgentModal,
      closeCreateAgentModal: modals.closeCreateAgentModal,
      openUploadPDFModal: modals.openUploadPDFModal,
      closeUploadPDFModal: modals.closeUploadPDFModal,
      closePopups: modals.closePopups,
      setAttachedFiles: chatState.setAttachedFiles,
      setIsGenerating: chatState.setIsGenerating,
    }),
    [
      sidebarOpen,
      mobileSidebarOpen,
      navigation,
      pdfPreviewOpenState,
      chatState,
      notebooks,
      agents,
      pdfState,
      generatedDocs,
      chatList,
      spinner,
      think,
      webSearch,
      triggers,
      i18n,
      toggleSidebar,
      openMobileSidebar,
      closeMobileSidebar,
      currentModel,
      searchQuery,
      modelSearchQuery,
    ]
  )

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

