import { useState, useCallback } from 'react'
import type {
  PDFSource,
  PDFChat,
  GeneratedDocument,
} from '@/entities/llamabook-document'
import { initialGeneratedDocs } from '@/shared/data'

interface UseGeneratedDocsOptions {
  pdfSources: PDFSource[]
  pdfChats: PDFChat[]
  currentPDFSourceId: string | null
  currentPDFChatId: string | null
  setCurrentGeneratedDocId: (id: string | null) => void
  setCanvasOpen: (value: boolean | ((prev: boolean) => boolean)) => void
  setSidebarOpen: (value: boolean | ((prev: boolean) => boolean)) => void
  setPdfPreviewOpen: (value: boolean | ((prev: boolean) => boolean)) => void
  setCurrentView: (view: import('../model/types').View) => void
}

export function useGeneratedDocs({
  pdfSources,
  pdfChats,
  currentPDFSourceId,
  currentPDFChatId,
  setCurrentGeneratedDocId,
  setCanvasOpen,
  setSidebarOpen,
  setPdfPreviewOpen,
  setCurrentView,
}: UseGeneratedDocsOptions) {
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocument[]>(initialGeneratedDocs)

  const openCanvas = useCallback(
    (docId?: string) => {
      if (docId) {
        setCurrentGeneratedDocId(docId)
      } else {
        const source = currentPDFSourceId
          ? pdfSources.find((s) => s.id === currentPDFSourceId)
          : undefined
        const chat = currentPDFChatId
          ? pdfChats.find((c) => c.id === currentPDFChatId)
          : undefined
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
  }, [
    currentPDFChatId,
    currentPDFSourceId,
    setCanvasOpen,
    setSidebarOpen,
    setPdfPreviewOpen,
    setCurrentView,
    setCurrentGeneratedDocId,
  ])

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

  return {
    generatedDocs,
    setGeneratedDocs,
    openCanvas,
    closeCanvas,
    updateGeneratedDoc,
    updateGeneratedDocTitle,
  }
}
