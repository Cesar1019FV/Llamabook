import { useCallback, useEffect, useState } from 'react'

export type ThinkMode = 'off' | 'on' | 'low' | 'medium' | 'high'
export type EffortMode = 'on' | 'low' | 'medium' | 'high'

const STORAGE_KEY = 'llamabook:think-mode'
const EFFORT_KEY = 'llamabook:think-effort'
const VALID_MODES: ThinkMode[] = ['off', 'on', 'low', 'medium', 'high']
const VALID_EFFORTS: EffortMode[] = ['on', 'low', 'medium', 'high']

export function useThinkMode() {
  const [thinkMode, setThinkModeState] = useState<ThinkMode>('on')
  const [lastEffort, setLastEffortState] = useState<EffortMode>('on')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && VALID_MODES.includes(saved as ThinkMode)) {
        setThinkModeState(saved as ThinkMode)
      }
      const savedEffort = localStorage.getItem(EFFORT_KEY)
      if (savedEffort && VALID_EFFORTS.includes(savedEffort as EffortMode)) {
        setLastEffortState(savedEffort as EffortMode)
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
    if (mode !== 'off') {
      setLastEffortState(mode)
      try {
        localStorage.setItem(EFFORT_KEY, mode)
      } catch {
        // ignore storage errors
      }
    }
  }, [])

  return {
    thinkMode,
    setThinkMode,
    lastEffort,
  }
}