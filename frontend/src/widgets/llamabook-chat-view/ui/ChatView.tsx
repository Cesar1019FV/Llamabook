import { useEffect, useCallback, useRef, useState } from 'react'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { MessageList } from './MessageList'
import { ScrollButton } from './ScrollButton'

const BOTTOM_THRESHOLD = 100

export function ChatView({ embedded = false }: { embedded?: boolean }) {
  const { currentView, messages, isGenerating } = useLlamabookDashboard()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [atBottom, setAtBottom] = useState(true)
  const isProgrammaticScroll = useRef(false)
  const rafRef = useRef<number | null>(null)
  const pendingScrollRef = useRef(false)

  const checkBottom = useCallback(() => {
    const el = scrollRef.current
    if (!el) return true
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    return distance < BOTTOM_THRESHOLD
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const el = scrollRef.current
    if (!el) return
    isProgrammaticScroll.current = true
    pendingScrollRef.current = false
    el.scrollTo({ top: el.scrollHeight, behavior })
    window.setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 100)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      if (isProgrammaticScroll.current) return
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const nearBottom = checkBottom()
        setAtBottom((prev) => {
          if (prev !== nearBottom) return nearBottom
          return prev
        })
      })
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [checkBottom])

  useEffect(() => {
    if (!atBottom) return
    const el = scrollRef.current
    if (!el) return
    isProgrammaticScroll.current = true
    el.scrollTop = el.scrollHeight
    window.setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 50)
  }, [messages, atBottom])

  useEffect(() => {
    if (isGenerating && atBottom) {
      pendingScrollRef.current = false
      scrollToBottom('auto')
    }
  }, [isGenerating, atBottom, scrollToBottom])

  useEffect(() => {
    if (currentView === 'chat' && !embedded) {
      setAtBottom(true)
      requestAnimationFrame(() => scrollToBottom('auto'))
    }
  }, [currentView, embedded, scrollToBottom])

  const handleScrollButtonClick = useCallback(() => {
    setAtBottom(true)
    scrollToBottom('smooth')
  }, [scrollToBottom])

  return (
    <div
      className={clsx(
        'relative flex flex-col min-h-0 overflow-hidden',
        embedded || currentView === 'chat' ? 'flex' : 'hidden'
      )}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <MessageList />
      </div>
      <ScrollButton visible={!atBottom} onClick={handleScrollButtonClick} />
    </div>
  )
}
