import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { MessageList } from './MessageList'
import { ScrollButton } from './ScrollButton'
import './ChatView.css'

export function ChatView() {
  const { currentView } = useLlamabookDashboard()
  const containerRef = useRef<HTMLDivElement>(null)
  const [showScroll, setShowScroll] = useState(false)

  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScroll(distance > 80)
  }

  const scrollToBottom = () => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      className={clsx('chat-view view', currentView === 'chat' && 'active')}
      onScroll={handleScroll}
    >
      <MessageList />
      <ScrollButton visible={showScroll} onClick={scrollToBottom} />
    </div>
  )
}
