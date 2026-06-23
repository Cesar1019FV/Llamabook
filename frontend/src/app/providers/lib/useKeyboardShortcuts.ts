import { useEffect } from 'react'
import type { View } from '../model/types'

interface UseKeyboardShortcutsOptions {
  currentView: View
  modelPopupOpen: boolean
  plusPopupOpen: boolean
  profileDropdownOpen: boolean
  settingsModalOpen: boolean
  createNotebookModalOpen: boolean
  createAgentModalOpen: boolean
  uploadPDFModalOpen: boolean
  canvasOpen: boolean
  currentPDFSourceId: string | null
  setSettingsModalOpen: (value: boolean) => void
  setCreateNotebookModalOpen: (value: boolean) => void
  setCreateAgentModalOpen: (value: boolean) => void
  setUploadPDFModalOpen: (value: boolean) => void
  setProfileDropdownOpen: (value: boolean) => void
  setPlusPopupOpen: (value: boolean) => void
  setModelPopupOpen: (value: boolean) => void
  closeCanvas: () => void
  showDashboard: () => void
  showPDFChatDetail: (id: string) => void
  showPDFChatList: () => void
  setSidebarOpen: (value: boolean | ((prev: boolean) => boolean)) => void
}

export function useKeyboardShortcuts({
  currentView,
  modelPopupOpen,
  plusPopupOpen,
  profileDropdownOpen,
  settingsModalOpen,
  createNotebookModalOpen,
  createAgentModalOpen,
  uploadPDFModalOpen,
  canvasOpen,
  currentPDFSourceId,
  setSettingsModalOpen,
  setCreateNotebookModalOpen,
  setCreateAgentModalOpen,
  setUploadPDFModalOpen,
  setProfileDropdownOpen,
  setPlusPopupOpen,
  setModelPopupOpen,
  closeCanvas,
  showDashboard,
  showPDFChatDetail,
  showPDFChatList,
  setSidebarOpen,
}: UseKeyboardShortcutsOptions) {
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
  }, [
    currentView,
    modelPopupOpen,
    plusPopupOpen,
    profileDropdownOpen,
    settingsModalOpen,
    createNotebookModalOpen,
    createAgentModalOpen,
    uploadPDFModalOpen,
    canvasOpen,
    closeCanvas,
    showDashboard,
    currentPDFSourceId,
    showPDFChatDetail,
    showPDFChatList,
    setSidebarOpen,
  ])
}
