import { useTranslation } from 'react-i18next'
import type { Message as MessageType } from '@/entities/llamabook-message'
import { CodeBlock } from './CodeBlock'

interface MessageProps {
  message: MessageType
}

export function Message({ message }: MessageProps) {
  const { t } = useTranslation()

  if (message.type === 'system') {
    return (
      <div className="msg-sys">
        <span>{message.text}</span>
      </div>
    )
  }

  if (message.type === 'user') {
    return (
      <div className="msg">
        <div className="msg-row-user">
          <div className="msg-text-user">{message.text.replace(/\n/g, '\n')}</div>
        </div>
        <div className="msg-meta-user">
          {message.time && <span className="msg-time">{message.time}</span>}
          {message.status && (
            <span className={['msg-status', message.status === 'error' ? 'err' : ''].filter(Boolean).join(' ')}>
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
    <div className="msg">
      <div className="msg-row-ai">
        <div className="msg-label">
          <div className="msg-label-icon ai">{t('dashboard.brand')[0]}</div>
        </div>
        <div className="msg-content">
          <div className="msg-sender">{t('dashboard.chatView.sender')}</div>
          <div
            className="msg-text-ai"
            dangerouslySetInnerHTML={{
              __html: message.text.replace(/\n/g, '<br />'),
            }}
          />
          {message.code && (
            <CodeBlock lang={message.code.lang} body={message.code.body} />
          )}
          <div className="msg-meta">
            {message.time && <span className="msg-time">{message.time}</span>}
            {message.status && (
              <span className={['msg-status', message.status === 'error' ? 'err' : ''].filter(Boolean).join(' ')}>
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
