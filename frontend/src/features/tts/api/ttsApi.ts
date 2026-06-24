import { API_URL } from '@/shared/config'

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

export async function fetchTtsAudio(
  chatId: string,
  messageId: string,
  voice: string,
  lang: string,
): Promise<Blob> {
  let token = getAccessToken()
  if (!token) throw new Error('Missing auth token')

  const doFetch = (tok: string) =>
    fetch(`${API_URL}/tts/chats/${chatId}/messages/${messageId}/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tok}`,
      },
      body: JSON.stringify({ voice, lang }),
    })

  let res = await doFetch(token)

  if (res.status === 401) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      token = refreshed
      res = await doFetch(token)
    }
  }

  if (!res.ok) {
    throw new Error(`TTS failed: HTTP ${res.status}`)
  }

  return await res.blob()
}