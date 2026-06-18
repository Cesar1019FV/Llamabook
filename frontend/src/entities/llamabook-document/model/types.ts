import type { Message } from '@/entities/llamabook-message'

export interface PDFSource {
  id: string
  name: string
  size: string
  pages: number
  color: string
  createdAt: number
  file?: File
  url?: string
}

export interface PDFChat {
  id: string
  sourceId: string
  title: string
  createdAt: number
  messages: Message[]
}

export type GeneratedDocType = 'draft' | 'report' | 'summary' | 'note'

export interface GeneratedDocument {
  id: string
  title: string
  content: string
  sourceId?: string
  chatId?: string
  type: GeneratedDocType
  createdAt: number
  updatedAt: number
}
