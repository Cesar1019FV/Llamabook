import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'llamabook:web-search-enabled'

export function useWebSearchEnabled() {
  const [enabled, setEnabledState] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved !== null) setEnabledState(saved === 'true')
    } catch {
      // ignore
    }
  }, [])

  const setEnabled = useCallback((v: boolean) => {
    setEnabledState(v)
    try {
      localStorage.setItem(STORAGE_KEY, String(v))
    } catch {
      // ignore
    }
  }, [])

  return { webSearchEnabled: enabled, setWebSearchEnabled: setEnabled }
}