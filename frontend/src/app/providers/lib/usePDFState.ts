import { useState, useCallback } from 'react'
import type { PDFSource, PDFChat } from '@/entities/llamabook-document'
import {
  initialPDFSources,
  initialPDFChats,
  newNotebookColors,
} from '@/shared/data'

interface UsePDFStateOptions {
  setCurrentView: (view: import('../model/types').View) => void
  setCurrentPDFChatId: (id: string | null) => void
  setCurrentPDFSourceId: (id: string | null) => void
  setCurrentChatId: (id: string | null) => void
  setCurrentNotebookId: (id: string | null) => void
  setCurrentAgentId: (id: string | null) => void
  setCurrentGeneratedDocId: (id: string | null) => void
  setMessages: React.Dispatch<React.SetStateAction<import('@/entities/llamabook-message').Message[]>>
  setAttachedFiles: React.Dispatch<React.SetStateAction<string[]>>
  setSidebarOpen: (value: boolean | ((prev: boolean) => boolean)) => void
  showPDFChatDetail: (id: string) => void
}

export function usePDFState({
  setCurrentView,
  setCurrentPDFChatId,
  setCurrentPDFSourceId,
  setCurrentChatId,
  setCurrentNotebookId,
  setCurrentAgentId,
  setCurrentGeneratedDocId,
  setMessages,
  setAttachedFiles,
  setSidebarOpen,
  showPDFChatDetail,
}: UsePDFStateOptions) {
  const [pdfSources, setPdfSources] = useState<PDFSource[]>(initialPDFSources)
  const [pdfChats, setPdfChats] = useState<PDFChat[]>(initialPDFChats)

  const showPDFChat = useCallback(
    (id: string) => {
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
      setAttachedFiles([])
      setSidebarOpen(false)
    },
    [pdfChats, setCurrentView, setCurrentPDFChatId, setCurrentPDFSourceId, setCurrentChatId, setCurrentNotebookId, setCurrentAgentId, setCurrentGeneratedDocId, setMessages, setAttachedFiles, setSidebarOpen]
  )

  const startPDFChat = useCallback(
    (sourceId: string) => {
      const id = 'pch_' + Date.now()
      const source = pdfSources.find((s) => s.id === sourceId)
      const title = source
        ? `Chat sobre ${source.name.replace(/\.pdf$/i, '')}`
        : 'Chat PDF'
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
      setAttachedFiles([])
      setSidebarOpen(false)
    },
    [pdfChats]
  )

  const uploadPDF = useCallback(
    (files: File[]) => {
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
    },
    [showPDFChatDetail]
  )

  return {
    pdfSources,
    setPdfSources,
    pdfChats,
    setPdfChats,
    showPDFChat,
    startPDFChat,
    openPDFChat,
    uploadPDF,
  }
}
