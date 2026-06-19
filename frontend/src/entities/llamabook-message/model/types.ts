export interface CodeBlock {
  lang: string
  body: string
}

export interface Message {
  id: string
  type: 'system' | 'user' | 'ai'
  text: string
  time?: string
  status?: 'sending' | 'sent' | 'error'
  code?: CodeBlock
}

export interface BackendMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface ChatStreamDelta {
  type: 'delta'
  content: string
  message_id?: string
}

export interface ChatStreamTitle {
  type: 'title'
  title: string
}

export interface ChatStreamDone {
  type: 'done'
  done: boolean
  message_id?: string
}

export type ChatStreamEvent = ChatStreamDelta | ChatStreamTitle | ChatStreamDone