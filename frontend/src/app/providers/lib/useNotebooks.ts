import { useState, useCallback } from 'react'
import type { Notebook } from '@/entities/llamabook-notebook'
import { initialNotebooks, newNotebookColors } from '@/shared/data'

export function useNotebooks() {
  const [notebooks, setNotebooks] = useState<Notebook[]>(initialNotebooks)
  const [expandedNotebooks, setExpandedNotebooks] = useState<Set<string>>(
    new Set(['infra'])
  )

  const toggleNotebook = useCallback((id: string) => {
    setExpandedNotebooks((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const collapseNotebook = useCallback((id: string) => {
    setExpandedNotebooks((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const addNotebook = useCallback((name: string) => {
    const id = 'cud_' + Date.now()
    const index = Math.floor(Math.random() * newNotebookColors.length)
    setNotebooks((prev) => [
      ...prev,
      {
        id,
        name: name.trim(),
        color: newNotebookColors[index],
        chats: [],
        context: '',
      },
    ])
  }, [])

  const updateNotebookContext = useCallback((id: string, context: string) => {
    setNotebooks((prev) =>
      prev.map((n) => (n.id === id ? { ...n, context: context.trim() } : n))
    )
  }, [])

  return {
    notebooks,
    setNotebooks,
    expandedNotebooks,
    setExpandedNotebooks,
    toggleNotebook,
    collapseNotebook,
    addNotebook,
    updateNotebookContext,
  }
}
