import { http } from '@/shared/api'
import { API_URL } from '@/shared/config'
import type { Chat } from '@/entities/llamabook-chat'
import type { BackendMessage, ChatStreamEvent } from '@/entities/llamabook-message'

const TOKEN_KEY = 'llamabook:access_token:v1'

function getAccessToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('llamabook:refresh_token:v1')
  if (!refreshToken) return null
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (!res.ok) return null
    const data = await res.json()
    localStorage.setItem(TOKEN_KEY, data.access_token)
    localStorage.setItem('llamabook:refresh_token:v1', data.refresh_token)
    return data.access_token as string
  } catch {
    return null
  }
}

export interface CreateChatPayload {
  title?: string
  model?: string
  notebook_id?: string
  agent_id?: string
  message?: string
}

export async function createChatApi(payload: CreateChatPayload): Promise<Chat> {
  return http.post<Chat>('/chats/', payload)
}

export async function listChatsApi(): Promise<Chat[]> {
  return http.get<Chat[]>('/chats/')
}

export async function getChatApi(chatId: string): Promise<Chat> {
  return http.get<Chat>(`/chats/${chatId}`)
}

export async function listMessagesApi(chatId: string): Promise<BackendMessage[]> {
  return http.get<BackendMessage[]>(`/chats/${chatId}/messages`)
}

export async function deleteChatApi(chatId: string): Promise<void> {
  await http.del<void>(`/chats/${chatId}`)
}

export async function updateChatApi(
  chatId: string,
  payload: { title?: string; pinned?: boolean },
): Promise<Chat> {
  return http.patch<Chat>(`/chats/${chatId}`, payload)
}

export interface StreamHandlers {
  onEvent: (event: ChatStreamEvent) => void
  onError?: (err: unknown) => void
  signal?: AbortSignal
}

async function openSSE(chatId: string, content: string, token: string): Promise<Response> {
  return fetch(`${API_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  })
}

export async function sendMessageStreamApi(
  chatId: string,
  content: string,
  handlers: StreamHandlers,
): Promise<void> {
  let token = getAccessToken()
  if (!token) {
    handlers.onError?.(new Error('Missing auth token'))
    return
  }

  let res = await openSSE(chatId, content, token)

  if (res.status === 401) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      token = refreshed
      res = await openSSE(chatId, content, token)
    }
  }

  if (!res.ok || !res.body) {
    handlers.onError?.(new Error(`Stream failed: HTTP ${res.status}`))
    return
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      if (handlers.signal?.aborted) break
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const raw of lines) {
        const line = raw.trim()
        if (!line.startsWith('data:')) continue
        const payload = line.slice(5).trim()
        if (!payload || payload === '{}') continue
        try {
          const event = JSON.parse(payload) as ChatStreamEvent
          handlers.onEvent(event)
        } catch {
          // ignore malformed line
        }
      }
    }
  } catch (err) {
    if (!handlers.signal?.aborted) handlers.onError?.(err)
  }
}