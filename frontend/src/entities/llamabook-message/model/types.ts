export interface CodeBlock {
  lang: string
  body: string
}

export interface WebSearchResult {
  title: string
  url: string
  content: string
}

export interface MessageImage {
  file_id: string
  name: string
  mime_type: string
}

export interface PendingImage {
  clientId: string
  file: File
  previewUrl: string
  fileId?: string
  uploading: boolean
}

export interface Message {
  id: string
  localKey: string
  type: 'system' | 'user' | 'ai'
  text: string
  thinking?: string
  webSearchResults?: WebSearchResult[]
  webSearchQuery?: string
  time?: string
  status?: 'sending' | 'sent' | 'error'
  code?: CodeBlock
  images?: MessageImage[]
}

export interface BackendMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  thinking?: string | null
  web_search_results?: WebSearchResult[] | null
  images?: MessageImage[] | null
  created_at: string
}

export interface ChatStreamDelta {
  type: 'delta'
  content: string
  message_id?: string
}

export interface ChatStreamThinking {
  type: 'thinking'
  thinking: string
  message_id?: string
}

export interface ChatStreamTitle {
  type: 'title'
  title: string
}

export interface ChatStreamWebSearch {
  type: 'web_search'
  web_search_query: string
  message_id?: string
}

export interface ChatStreamWebSearchResults {
  type: 'web_search_results'
  web_search_results: WebSearchResult[]
  message_id?: string
}

export interface ChatStreamDone {
  type: 'done'
  done: boolean
  message_id?: string
}

export interface ChatStreamUserMessage {
  type: 'user_message'
  message_id: string
}

export type ChatStreamEvent =
  | ChatStreamDelta
  | ChatStreamThinking
  | ChatStreamTitle
  | ChatStreamWebSearch
  | ChatStreamWebSearchResults
  | ChatStreamDone
  | ChatStreamUserMessage