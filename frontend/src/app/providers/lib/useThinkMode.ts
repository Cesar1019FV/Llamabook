import { useCallback, useEffect, useState } from 'react'

export type ThinkMode = 'off' | 'on' | 'low' | 'medium' | 'high'

const STORAGE_KEY = 'llamabook:think-mode'
const VALID_MODES: ThinkMode[] = ['off', 'on', 'low', 'medium', 'high']

export function useThinkMode() {
  const [thinkMode, setThinkModeState] = useState<ThinkMode>('on')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && VALID_MODES.includes(saved as ThinkMode)) {
        setThinkModeState(saved as ThinkMode)
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  const setThinkMode = useCallback((mode: ThinkMode) => {
    setThinkModeState(mode)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // ignore storage errors
    }
  }, [])

  return {
    thinkMode,
    setThinkMode,
  }
}