import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import type { Message as MessageType } from '@/entities/llamabook-message'
import { CodeBlock } from './CodeBlock'

interface MessageProps {
  message: MessageType
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
