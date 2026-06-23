import { useState, useCallback } from 'react'
import type { View } from '../model/types'

const RESET_STATE = {
  currentChatId: null as string | null,
  currentNotebookId: null as string | null,
  currentAgentId: null as string | null,
  currentPDFSourceId: null as string | null,
  currentPDFChatId: null as string | null,
  currentGeneratedDocId: null as string | null,
  canvasOpen: false,
}

interface UseNavigationOptions {
  setSidebarOpen: (value: boolean | ((prev: boolean) => boolean)) => void
}

export function useNavigation({
  setSidebarOpen,
}: UseNavigationOptions) {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [currentNotebookId, setCurrentNotebookId] = useState<string | null>(null)
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null)
  const [currentPDFSourceId, setCurrentPDFSourceId] = useState<string | null>(null)
  const [currentPDFChatId, setCurrentPDFChatId] = useState<string | null>(null)
  const [currentGeneratedDocId, setCurrentGeneratedDocId] = useState<string | null>(null)
  const [canvasOpen, setCanvasOpen] = useState(false)

  const resetNavigation = useCallback(() => {
    setCurrentChatId(RESET_STATE.currentChatId)
    setCurrentNotebookId(RESET_STATE.currentNotebookId)
    setCurrentAgentId(RESET_STATE.currentAgentId)
    setCurrentPDFSourceId(RESET_STATE.currentPDFSourceId)
    setCurrentPDFChatId(RESET_STATE.currentPDFChatId)
    setCurrentGeneratedDocId(RESET_STATE.currentGeneratedDocId)
    setCanvasOpen(RESET_STATE.canvasOpen)
  }, [])

  const navigateTo = useCallback(
    (view: View) => {
      setCurrentView(view)
      resetNavigation()
    },
    [resetNavigation]
  )

  const showDashboard = useCallback(() => navigateTo('dashboard'), [navigateTo])
  const showNotebooksList = useCallback(() => navigateTo('notebooks-list'), [navigateTo])
  const showAgentsList = useCallback(() => navigateTo('agents-list'), [navigateTo])
  const showPDFChatList = useCallback(() => navigateTo('pdf-chat-list'), [navigateTo])
  const showLibrary = useCallback(() => navigateTo('library'), [navigateTo])

  const showNotebookDetail = useCallback(
    (id: string) => {
      setCurrentView('notebook-detail')
      setCurrentNotebookId(id)
      setCurrentChatId(null)
      setCurrentAgentId(null)
      setCurrentPDFSourceId(null)
      setCurrentPDFChatId(null)
      setCurrentGeneratedDocId(null)
      setCanvasOpen(false)
    },
    []
  )

  const showAgentDetail = useCallback(
    (id: string) => {
      setCurrentView('agent-detail')
      setCurrentAgentId(id)
      setCurrentChatId(null)
      setCurrentNotebookId(null)
      setCurrentPDFSourceId(null)
      setCurrentPDFChatId(null)
      setCurrentGeneratedDocId(null)
      setCanvasOpen(false)
    },
    []
  )

  const showPDFChatDetail = useCallback(
    (id: string) => {
      setCurrentView('pdf-chat-detail')
      setCurrentPDFSourceId(id)
      setCurrentChatId(null)
      setCurrentNotebookId(null)
      setCurrentAgentId(null)
      setCurrentPDFChatId(null)
      setCurrentGeneratedDocId(null)
      setCanvasOpen(false)
    },
    []
  )

  return {
    currentView,
    currentChatId,
    currentNotebookId,
    currentAgentId,
    currentPDFSourceId,
    currentPDFChatId,
    currentGeneratedDocId,
    canvasOpen,
    setCurrentView,
    setCurrentChatId,
    setCurrentNotebookId,
    setCurrentAgentId,
    setCurrentPDFSourceId,
    setCurrentPDFChatId,
    setCurrentGeneratedDocId,
    setCanvasOpen,
    showDashboard,
    showNotebooksList,
    showNotebookDetail,
    showAgentsList,
    showAgentDetail,
    showPDFChatList,
    showPDFChatDetail,
    showLibrary,
    navigateTo,
    setSidebarOpen,
  }
}
