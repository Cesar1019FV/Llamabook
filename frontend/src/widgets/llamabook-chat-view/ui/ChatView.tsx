import { useEffect, useCallback, useRef, useState } from 'react'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { MessageList } from './MessageList'
import { ScrollButton } from './ScrollButton'

export function ChatView() {
  const { currentView, messages, isGenerating } = useLlamabookDashboard()
  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [showScroll, setShowScroll] = useState(false)
  const isNearBottom = useRef(true)

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      isNearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
      setShowScroll(!isNearBottom.current)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sentinel = sentinelRef.current
    const scrollEl = scrollRef.current
    if (!sentinel || !scrollEl) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        isNearBottom.current = entry.isIntersecting
        setShowScroll(!entry.isIntersecting)
      },
      { root: scrollEl, threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isNearBottom.current) {
      const el = scrollRef.current
      if (!el) return
      el.scrollTop = el.scrollHeight
    }
  }, [messages.length, isGenerating])

  useEffect(() => {
    if (currentView === 'chat') {
      isNearBottom.current = true
      requestAnimationFrame(() => {
        const el = scrollRef.current
        if (el) el.scrollTop = el.scrollHeight
      })
    }
  }, [currentView])

  return (
    <div
      className={clsx(
        'flex flex-col min-h-0 overflow-hidden',
        currentView === 'chat' ? 'flex' : 'hidden'
      )}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <MessageList />
        <div ref={sentinelRef} />
      </div>
      <ScrollButton visible={showScroll} onClick={scrollToBottom} />
    </div>
  )
}
