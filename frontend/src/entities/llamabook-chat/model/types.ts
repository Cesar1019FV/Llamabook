export interface Chat {
  id: string
  title: string
}

export interface ChatGroup {
  label: string
  chats: Chat[]
}
