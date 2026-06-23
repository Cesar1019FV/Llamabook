import type { Message } from '@/entities/llamabook-message'
import type { Model } from '@/entities/llamabook-model'
import type { Notebook } from '@/entities/llamabook-notebook'
import type { Agent } from '@/entities/llamabook-agent'
import type { Chat } from '@/entities/llamabook-chat'
import type {
  PDFSource,
  PDFChat,
  GeneratedDocument,
} from '@/entities/llamabook-document'
import type { i18n } from 'i18next'

export type View =
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

export interface DashboardState {
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
  chats: Chat[]
  spinnerVariant: 'asterisk' | 'llama' | 'nova' | 'orbit'
  i18n: i18n
}

export interface DashboardActions {
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
  regenerateMessage: (aiMessageId: string, userText: string) => void
  refreshChats: () => Promise<void>
  pinChat: (chatId: string, pinned: boolean) => Promise<void>
  renameChat: (chatId: string, title: string) => Promise<void>
  deleteChat: (chatId: string) => Promise<void>
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
  setSpinnerVariant: (variant: 'asterisk' | 'llama' | 'nova' | 'orbit') => void
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

export interface DashboardContextValue extends DashboardState, DashboardActions {}
