import { useEffect, useRef } from 'react'
import { useLlamabookDashboard } from '@/app/providers'
import { Message } from './Message'

export function MessageList() {
  const { messages, isGenerating } = useLlamabookDashboard()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages, isGenerating])

  return (
    <div className="chat-scroll">
      <div>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isGenerating && (
          <div className="msg">
            <div className="msg-row-ai">
              <div className="msg-label">
                <div className="msg-label-icon ai">L</div>
              </div>
              <div className="msg-content">
                <div className="gen">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
