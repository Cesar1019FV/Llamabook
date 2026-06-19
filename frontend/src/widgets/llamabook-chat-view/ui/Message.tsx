import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import type { Message as MessageType, WebSearchResult } from '@/entities/llamabook-message'
import { CodeBlock } from './CodeBlock'

interface MessageProps {
  message: MessageType
}

function ThinkingBlock({ text }: { text: string }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mb-2">
      <button
        className="flex items-center gap-1.5 text-[12px] text-llama-fg-4 hover:text-llama-fg-2 transition-colors duration-100"
        onClick={() => setExpanded((v) => !v)}
        type="button"
      >
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={clsx('transition-transform duration-200', expanded && 'rotate-90')}>
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="font-medium">{t('dashboard.chatView.thinking')}</span>
      </button>
      {expanded && (
        <div className="mt-1.5 pl-4 border-l border-llama-border text-[13px] text-llama-fg-4 font-sans leading-[1.6] whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto">
          {text}
        </div>
      )}
    </div>
  )
}

function WebSearchResults({ results }: { results: WebSearchResult[] }) {
  const { t } = useTranslation()

  return (
    <div className="mb-2.5">
      <div className="flex items-center gap-1.5 text-[12px] text-llama-fg-4 mb-1.5">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="font-medium">{t('dashboard.chatView.webSearchResults')}</span>
        <span className="text-llama-fg-5">({results.length})</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {results.map((r, i) => (
          <a
            key={i}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-2.5 py-2 rounded-lg border border-llama-border bg-llama-surface/50 hover:bg-llama-surface hover:border-llama-border-2 transition-all duration-100 group"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] text-llama-fg-2 font-medium leading-tight truncate group-hover:text-llama-accent-light transition-colors">
                  {r.title || r.url}
                </div>
                <div className="text-[10.5px] text-llama-fg-5 truncate mt-0.5">
                  {r.url}
                </div>
                {r.content && (
                  <div className="text-[11.5px] text-llama-fg-4 mt-1 line-clamp-2 leading-snug">
                    {r.content}
                  </div>
                )}
              </div>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-llama-fg-5 shrink-0 mt-0.5">
                <path d="M7 17l9.2-9.2M7 7h10v10" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export function Message({ message }: MessageProps) {
  const { t } = useTranslation()

  if (message.type === 'system') {
    return (
      <div className="msg-sys text-center py-4">
        <span className="text-[12px] text-llama-fg-5">{message.text}</span>
      </div>
    )
  }

  if (message.type === 'user') {
    return (
      <div className="msg py-3.5 msg-in">
        <div className="msg-row-user flex justify-end">
          <div className="msg-text-user font-sans text-[15px] font-normal leading-relaxed text-llama-fg text-right max-w-[85%] break-words">
            {message.text.replace(/\n/g, '\n')}
          </div>
        </div>
        <div className="msg-meta-user flex items-center gap-2 mt-1.5 justify-end">
          {message.time && <span className="msg-time text-[11px] text-llama-fg-5 font-normal">{message.time}</span>}
          {message.status && (
            <span
              className={clsx(
                'msg-status text-[11px] text-llama-fg-5 font-normal',
                message.status === 'error' && 'text-llama-error cursor-pointer'
              )}
            >
              {message.status === 'error'
                ? t('dashboard.chatView.status.error')
                : message.status === 'sending'
                  ? t('dashboard.chatView.status.sending')
                  : t('dashboard.chatView.status.sent')}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="msg py-3.5 msg-in">
      <div className="msg-row-ai flex gap-3.5 items-start">
        <div className="msg-label w-[26px] shrink-0 flex items-center justify-center pt-0.5">
          <div className="msg-label-icon ai w-[22px] h-[22px] rounded-full bg-gradient-to-br from-llama-accent to-llama-accent-light flex items-center justify-center text-[10px] font-semibold text-white shrink-0">
            {t('dashboard.brand')[0]}
          </div>
        </div>

        <div className="msg-content flex-1 min-w-0">
          <div className="msg-sender text-[12px] font-semibold text-llama-accent-light mb-[5px] leading-none">
            {t('dashboard.chatView.sender')}
          </div>

          {message.webSearchResults && message.webSearchResults.length > 0 && (
            <WebSearchResults results={message.webSearchResults} />
          )}

          {message.thinking && <ThinkingBlock text={message.thinking} />}

          <div
            className="msg-text-ai font-serif text-[15px] font-normal leading-[1.7] text-llama-fg max-w-full break-words [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{
              __html: message.text.replace(/\n/g, '<br />'),
            }}
          />
          {message.code && (
            <CodeBlock lang={message.code.lang} body={message.code.body} />
          )}
          <div className="msg-meta flex items-center gap-2 mt-1.5 pl-10">
            {message.time && <span className="msg-time text-[11px] text-llama-fg-5 font-normal">{message.time}</span>}
            {message.status && (
              <span
                className={clsx(
                  'msg-status text-[11px] text-llama-fg-5 font-normal',
                  message.status === 'error' && 'text-llama-error cursor-pointer'
                )}
              >
                {message.status === 'error'
                  ? t('dashboard.chatView.status.error')
                  : message.status === 'sending'
                    ? t('dashboard.chatView.status.sending')
                    : t('dashboard.chatView.status.sent')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}