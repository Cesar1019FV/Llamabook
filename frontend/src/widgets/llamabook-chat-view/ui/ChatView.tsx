import { useEffect, useCallback, useRef, useState } from 'react'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { MessageList } from './MessageList'
import { ScrollButton } from './ScrollButton'

export function ChatView() {
  const { currentView, messages, isGenerating } = useLlamabookDashboard()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScroll, setShowScroll] = useState(false)
  const isNearBottom = useRef(true)

  const checkNearBottom = useCallback(() => {
    const el = scrollRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }, [])

  const handleScroll = useCallback(() => {
    isNearBottom.current = checkNearBottom()
    setShowScroll(!isNearBottom.current)
  }, [checkNearBottom])

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    isNearBottom.current = true
    setShowScroll(false)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

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
      </div>
      <ScrollButton visible={showScroll} onClick={scrollToBottom} />
    </div>
  )
}
