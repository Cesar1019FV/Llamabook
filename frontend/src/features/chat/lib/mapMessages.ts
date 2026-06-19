import type { Message, BackendMessage } from '@/entities/llamabook-message'

function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    return (
      d.getHours().toString().padStart(2, '0') +
      ':' +
      d.getMinutes().toString().padStart(2, '0')
    )
  } catch {
    return ''
  }
}

export function mapBackendMessage(m: BackendMessage): Message {
  const type: Message['type'] = m.role === 'user' ? 'user' : m.role === 'assistant' ? 'ai' : 'system'
  return {
    id: m.id,
    type,
    text: m.content,
    thinking: m.thinking ?? undefined,
    webSearchResults: m.web_search_results ?? undefined,
    time: formatTime(m.created_at),
    status: 'sent',
  }
}

export function mapBackendMessages(messages: BackendMessage[]): Message[] {
  return messages.map(mapBackendMessage)
}