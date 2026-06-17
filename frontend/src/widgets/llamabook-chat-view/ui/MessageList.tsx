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
    <div className="chat-scroll max-w-[740px] mx-auto px-4 md:px-7 py-4 md:py-6 pb-[120px]">
      <div>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        {isGenerating && (
          <div className="msg py-3.5 msg-in">
            <div className="msg-row-ai flex gap-3.5 items-start">
              <div className="msg-label w-[26px] shrink-0 flex items-center justify-center pt-0.5">
                <div className="msg-label-icon ai w-[22px] h-[22px] rounded-full bg-gradient-to-br from-llama-accent to-llama-accent-light flex items-center justify-center text-[10px] font-semibold text-white shrink-0">L</div>
              </div>
              <div className="msg-content flex-1 min-w-0">
                <div className="gen inline-flex gap-[5px] py-1">
                  <span className="w-[5px] h-[5px] rounded-full bg-llama-fg-4 animate-bounce" />
                  <span className="w-[5px] h-[5px] rounded-full bg-llama-fg-4 animate-bounce [animation-delay:150ms]" />
                  <span className="w-[5px] h-[5px] rounded-full bg-llama-fg-4 animate-bounce [animation-delay:300ms]" />
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
