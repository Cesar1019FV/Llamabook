export interface Chat {
  id: string
  title: string | null
  model: string
  pinned: boolean
  created_at: string
  updated_at: string
}

export interface ChatGroup {
  label: 'today' | 'yesterday' | 'last7Days'
  chats: Chat[]
}