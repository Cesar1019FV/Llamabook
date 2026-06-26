import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'llamabook:memory_buffer'
const MAX_MESSAGES = 5

interface MemoryBuffer {
  messages: string[]
}

function loadBuffer(): MemoryBuffer {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as MemoryBuffer
      if (Array.isArray(parsed.messages)) return parsed
    }
  } catch {
    // ignore
  }
  return { messages: [] }
}

function saveBuffer(buffer: MemoryBuffer): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buffer))
  } catch {
    // ignore
  }
}

export function useMemoryBuffer() {
  const [buffer, setBuffer] = useState<MemoryBuffer>(() => loadBuffer())

  useEffect(() => {
    saveBuffer(buffer)
  }, [buffer])

  const addMemoryMessage = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setBuffer((prev) => {
      const nextMessages = [...prev.messages, trimmed].slice(-MAX_MESSAGES)
      return { messages: nextMessages }
    })
  }, [])

  const clearMemoryBuffer = useCallback(() => {
    setBuffer({ messages: [] })
  }, [])

  return {
    memoryMessages: buffer.messages,
    memoryCount: buffer.messages.length,
    addMemoryMessage,
    clearMemoryBuffer,
  }
}