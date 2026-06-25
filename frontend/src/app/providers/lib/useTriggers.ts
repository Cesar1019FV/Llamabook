import { useCallback, useEffect, useRef, useState } from 'react'
import type { TriggerSettings, UserPreferences } from '@/entities/user'
import { useAuth } from '@/features/auth'

const STORAGE_KEY = 'llamabook:triggers'
const SYNC_DELAY = 1500

const DEFAULT_SETTINGS: TriggerSettings = {
  enabled: true,
  webSearch: [
    'busca',
    'buscar',
    'busca en internet',
    'internet',
    'googlea',
    'googlealo',
    'actualidad',
    'noticias',
    'hoy',
    'últimas',
    'ultimo',
    'reciente',
    'web',
    'en línea',
    'en linea',
    'busca en la web',
    'buscame',
    'consulta',
    'investiga',
  ],
  thinking: [
    'analiza',
    'analizar',
    'piensa',
    'pensar',
    'razona',
    'razonar',
    'resuelve',
    'resolver',
    'paso a paso',
    'desglosa',
    'desglosar',
    'explica paso',
    'explicame paso',
    'explica detalladamente',
    'piensa despacio',
    'razona paso',
  ],
}

function loadFromStorage(): TriggerSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<TriggerSettings>
    return {
      enabled: parsed.enabled ?? DEFAULT_SETTINGS.enabled,
      webSearch: Array.isArray(parsed.webSearch) ? parsed.webSearch : DEFAULT_SETTINGS.webSearch,
      thinking: Array.isArray(parsed.thinking) ? parsed.thinking : DEFAULT_SETTINGS.thinking,
    }
  } catch {
    return null
  }
}

const URL_REGEX = /https?:\/\/[^\s<>"']+/i

export function detectUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s<>"']+/gi) ?? []
  return matches
}

export function hasUrl(text: string): boolean {
  return URL_REGEX.test(text)
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function matchesKeywords(text: string, keywords: string[]): boolean {
  if (keywords.length === 0) return false
  const normalizedText = normalize(text)
  for (const kw of keywords) {
    const nkw = normalize(kw)
    if (!nkw) continue
    const re = new RegExp(`(^|[^\\p{L}])${escapeRegex(nkw)}([^\\p{L}]|$)`, 'iu')
    if (re.test(normalizedText)) return true
  }
  return false
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function useTriggers() {
  const { user, syncPreferences } = useAuth()
  const [settings, setSettings] = useState<TriggerSettings>(() => loadFromStorage() ?? DEFAULT_SETTINGS)
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialLoadRef = useRef(true)

  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false
      const local = loadFromStorage()
      if (local) {
        setSettings(local)
        return
      }
      if (user?.preferences?.triggers) {
        const serverTriggers = user.preferences.triggers
        setSettings(serverTriggers)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverTriggers))
        } catch {
          // ignore
        }
      }
    }
  }, [user])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // ignore
    }
  }, [settings])

  const scheduleSync = useCallback(
    (next: TriggerSettings) => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
      syncTimerRef.current = setTimeout(() => {
        const prefs: UserPreferences = { triggers: next }
        syncPreferences(prefs).catch(() => {
          // ignore sync errors — local is source of truth
        })
      }, SYNC_DELAY)
    },
    [syncPreferences]
  )

  useEffect(() => {
    if (!user) return
    scheduleSync(settings)
  }, [settings, user, scheduleSync])

  const toggleEnabled = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, enabled: !prev.enabled }
      return next
    })
  }, [])

  const addWebSearchKeyword = useCallback((kw: string) => {
    const trimmed = kw.trim()
    if (!trimmed) return
    setSettings((prev) => {
      if (prev.webSearch.some((k) => normalize(k) === normalize(trimmed))) return prev
      return { ...prev, webSearch: [...prev.webSearch, trimmed] }
    })
  }, [])

  const removeWebSearchKeyword = useCallback((kw: string) => {
    setSettings((prev) => ({
      ...prev,
      webSearch: prev.webSearch.filter((k) => k !== kw),
    }))
  }, [])

  const addThinkingKeyword = useCallback((kw: string) => {
    const trimmed = kw.trim()
    if (!trimmed) return
    setSettings((prev) => {
      if (prev.thinking.some((k) => normalize(k) === normalize(trimmed))) return prev
      return { ...prev, thinking: [...prev.thinking, trimmed] }
    })
  }, [])

  const removeThinkingKeyword = useCallback((kw: string) => {
    setSettings((prev) => ({
      ...prev,
      thinking: prev.thinking.filter((k) => k !== kw),
    }))
  }, [])

  const detectTriggers = useCallback(
    (text: string): { webSearch: boolean; webFetch: boolean; thinking: boolean; urls: string[] } => {
      const result = { webSearch: false, webFetch: false, thinking: false, urls: [] as string[] }
      if (!settings.enabled) return result

      const urls = detectUrls(text)
      if (urls.length > 0) {
        result.webFetch = true
        result.urls = urls
      }

      if (matchesKeywords(text, settings.webSearch)) {
        result.webSearch = true
      }

      if (matchesKeywords(text, settings.thinking)) {
        result.thinking = true
      }

      return result
    },
    [settings]
  )

  return {
    settings,
    toggleEnabled,
    addWebSearchKeyword,
    removeWebSearchKeyword,
    addThinkingKeyword,
    removeThinkingKeyword,
    detectTriggers,
  }
}