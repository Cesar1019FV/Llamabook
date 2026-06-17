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
