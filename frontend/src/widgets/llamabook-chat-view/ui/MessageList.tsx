import { useMemo } from 'react'
import { useLlamabookDashboard } from '@/app/providers'
import { useTtsPlayer } from '@/features/tts'
import { Message } from './Message'

export function MessageList() {
  const { messages } = useLlamabookDashboard()
  const tts = useTtsPlayer()
  const lastAiIndex = messages.findLastIndex((m) => m.type === 'ai')

  const userTextByIndex = useMemo(() => {
    const map: Record<number, string | undefined> = {}
    let lastUserText: string | undefined
    messages.forEach((m, i) => {
      if (m.type === 'user') lastUserText = m.text
      map[i] = lastUserText
    })
    return map
  }, [messages])

  return (
    <div className="chat-scroll max-w-[740px] mx-auto px-4 md:px-7 py-4 md:py-6 pb-[200px]">
      <div>
        {messages.map((message, index) => (
          <Message
            key={message.localKey}
            message={message}
            isLast={index === lastAiIndex && message.type === 'ai'}
            userText={message.type === 'ai' ? userTextByIndex[index] : undefined}
            ttsPlayingKey={tts.playingKey}
            ttsLoadingKey={tts.loadingKey}
            onTtsPlay={tts.play}
            onTtsStop={tts.stop}
          />
        ))}
      </div>
    </div>
  )
}