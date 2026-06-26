import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import type { Message as MessageType, WebSearchResult } from '@/entities/llamabook-message'
import { LlamabookSpinner } from '@/shared/ui/icons/LlamabookSpinner'
import { IconCopy, IconCheck, IconPlay, IconPause, IconRefresh, IconPen } from '@/shared/ui/icons'
import { AuthImage } from '@/shared/ui/AuthImage'
import { useLlamabookDashboard } from '@/app/providers'
import { getVoiceSettings } from '@/features/tts'
import { CodeBlock } from './CodeBlock'
import { MarkdownRenderer } from './MarkdownRenderer'

interface MessageProps {
  message: MessageType
  isLast?: boolean
  userText?: string
  ttsPlayingKey: string | null
  ttsLoadingKey: string | null
  onTtsPlay: (chatId: string, messageId: string, text: string, voice: string, lang: string) => void
  onTtsStop: () => void
}

function ThinkingBlock({ text, active }: { text: string; active?: boolean }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const preview = text.slice(0, 70).trim()
  const hasMore = text.length > 70

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="group flex items-center gap-1.5 text-left"
      >
        <span className={clsx('text-[12.5px] font-medium', active ? 'thinking-text' : 'text-llama-fg-5 group-hover:text-llama-fg-3 transition-colors duration-150')}>
          {t('dashboard.chatView.thinking')}
        </span>
        {!expanded && (
          <span className="text-[12.5px] text-llama-fg-5 group-hover:text-llama-fg-3 transition-colors duration-150">
            {' · '}
            {preview}
            {hasMore && '...'}
          </span>
        )}
      </button>

      <div
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-out',
          expanded ? 'max-h-[600px] opacity-100 mt-1.5' : 'max-h-0 opacity-0 mt-0'
        )}
      >
        <div className="pl-3 border-l border-llama-border-2">
          <div className="thinking-glow rounded-lg px-2.5 py-2">
            <MarkdownRenderer>{text}</MarkdownRenderer>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchingBlock({ query }: { query: string }) {
  return (
    <div className="mb-2.5 flex items-center gap-2 text-[12px] text-llama-fg-4">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span className="font-medium">{query}</span>
      <span className="w-1 h-1 rounded-full bg-llama-fg-4 animate-bounce" />
      <span className="w-1 h-1 rounded-full bg-llama-fg-4 animate-bounce [animation-delay:150ms]" />
      <span className="w-1 h-1 rounded-full bg-llama-fg-4 animate-bounce [animation-delay:300ms]" />
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

export function Message({ message, isLast, userText, ttsPlayingKey, ttsLoadingKey, onTtsPlay, onTtsStop }: MessageProps) {
  const { t } = useTranslation()
  const { spinnerVariant, regenerateMessage, isGenerating, editMessage, currentChatId } = useLlamabookDashboard()
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(message.text)

  const isPlaying = ttsPlayingKey !== null && ttsPlayingKey.startsWith(`${message.id}:`)
  const isLoadingAudio = ttsLoadingKey !== null && ttsLoadingKey.startsWith(`${message.id}:`)

  const handlePlay = useCallback(() => {
    if (!currentChatId) return
    if (isPlaying) {
      onTtsStop()
      return
    }
    const settings = getVoiceSettings()
    onTtsPlay(currentChatId, message.id, message.text, settings.voice, settings.lang)
  }, [currentChatId, message.id, message.text, isPlaying, onTtsPlay, onTtsStop])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }, [message.text])

  const handleRefresh = useCallback(() => {
    if (!userText) return
    regenerateMessage(message.id, userText)
  }, [message.id, userText, regenerateMessage])

  const handleEditSubmit = useCallback(() => {
    const trimmed = editText.trim()
    if (!trimmed || trimmed === message.text) {
      setIsEditing(false)
      return
    }
    editMessage(message.id, trimmed)
    setIsEditing(false)
  }, [editText, message.id, message.text, editMessage])

  const handleEditCancel = useCallback(() => {
    setEditText(message.text)
    setIsEditing(false)
  }, [message.text])

  if (message.type === 'system') {
    return (
      <div className="msg-sys text-center py-4">
        <span className="text-[12px] text-llama-fg-5">{message.text}</span>
      </div>
    )
  }

  if (message.type === 'user') {
    if (isEditing) {
      return (
        <div className="msg py-3.5 msg-in">
          <div className="flex flex-col items-end gap-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleEditSubmit()
                }
                if (e.key === 'Escape') {
                  handleEditCancel()
                }
              }}
              className="w-full max-w-[85%] min-h-[60px] rounded-2xl bg-llama-surface border border-llama-border px-4 py-3 text-[15px] font-normal text-llama-fg outline-none focus:border-llama-border-2 resize-none"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEditCancel}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-llama-fg-4 hover:text-llama-fg-2 hover:bg-white/[0.06] transition-colors duration-100"
              >
                {t('dashboard.chatView.actions.cancel')}
              </button>
              <button
                type="button"
                onClick={handleEditSubmit}
                disabled={!editText.trim() || editText.trim() === message.text}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-llama-accent text-white hover:bg-llama-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-100"
              >
                {t('dashboard.chatView.actions.send')}
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="msg py-3.5 msg-in group">
        <div className="flex flex-col items-end gap-1">
          {message.images && message.images.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end max-w-[85%]">
              {message.images.map((img) => (
                <div
                  key={img.file_id}
                  className="w-[120px] h-[120px] rounded-xl overflow-hidden border border-llama-border-2 bg-llama-surface"
                >
                  <AuthImage
                    src={`/files/${img.file_id}/download`}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="msg-text-user font-sans text-[15px] font-normal leading-relaxed text-llama-fg text-right max-w-[85%] break-words rounded-2xl bg-llama-surface border border-llama-border px-4 py-2.5">
            {message.text.replace(/\n/g, '\n')}
          </div>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 px-1">
            <button
              type="button"
              onClick={handleCopy}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-llama-fg-5 hover:text-llama-fg-3 hover:bg-white/[0.06] transition-colors duration-100"
              aria-label={copied ? t('dashboard.chatView.actions.copied') : t('dashboard.chatView.actions.copy')}
            >
              {copied ? <IconCheck className="w-3.5 h-3.5 stroke-[1.8] text-llama-online" /> : <IconCopy className="w-3.5 h-3.5 stroke-[1.8]" />}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-llama-fg-5 hover:text-llama-fg-3 hover:bg-white/[0.06] transition-colors duration-100"
              aria-label={t('dashboard.chatView.actions.edit')}
            >
              <IconPen className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="msg py-3.5 msg-in">
      <div className="msg-row-ai flex gap-3.5 items-start">
        <div className="msg-label w-[32px] shrink-0 flex items-start justify-center pt-0.5">
          {message.text.length === 0 && (
            <LlamabookSpinner size={28} variant={spinnerVariant} spinning={isLast && isGenerating} className="text-llama-accent" />
          )}
        </div>

        <div className="msg-content flex-1 min-w-0">
          {message.webSearchQuery && message.webSearchQuery.length > 0 && (
            <SearchingBlock query={message.webSearchQuery} />
          )}

          {message.webSearchResults && message.webSearchResults.length > 0 && (
            <WebSearchResults results={message.webSearchResults} />
          )}

          {message.thinking && (
            <div className="mb-2">
              <ThinkingBlock text={message.thinking} active={message.status === 'sending'} />
            </div>
          )}

          <MarkdownRenderer>{message.text}</MarkdownRenderer>

          {message.text.length > 0 && message.status !== 'sent' && (
            <div className="mt-4">
              <LlamabookSpinner size={28} variant={spinnerVariant} spinning={isLast && isGenerating} className="text-llama-accent" />
            </div>
          )}

          {message.code && (
            <CodeBlock lang={message.code.lang} body={message.code.body} />
          )}

          {message.status === 'sent' && isLast && (
            <div className="flex items-center gap-0.5 mt-2.5">
              <button
                type="button"
                onClick={handleCopy}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-llama-fg-5 hover:text-llama-fg-3 hover:bg-white/[0.06] transition-colors duration-100"
                aria-label={copied ? t('dashboard.chatView.actions.copied') : t('dashboard.chatView.actions.copy')}
              >                {copied ? <IconCheck className="w-3.5 h-3.5 stroke-[1.8] text-llama-online" /> : <IconCopy className="w-3.5 h-3.5 stroke-[1.8]" />}
              </button>
              <button
                type="button"
                onClick={handlePlay}
                disabled={isLoadingAudio}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-llama-fg-5 hover:text-llama-fg-3 hover:bg-white/[0.06] transition-colors duration-100 disabled:opacity-50"
                aria-label={isPlaying ? t('dashboard.chatView.actions.pause') : t('dashboard.chatView.actions.play')}
              >
                {isLoadingAudio ? (
                  <LlamabookSpinner size={14} variant={spinnerVariant} spinning className="text-llama-accent" />
                ) : isPlaying ? (
                  <IconPause className="w-3.5 h-3.5 stroke-[1.8]" />
                ) : (
                  <IconPlay className="w-3.5 h-3.5 stroke-[1.8]" />
                )}
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-llama-fg-5 hover:text-llama-fg-3 hover:bg-white/[0.06] transition-colors duration-100"
                aria-label={t('dashboard.chatView.actions.refresh')}
              >
                <IconRefresh className="w-3.5 h-3.5 stroke-[1.8]" />
              </button>
            </div>
          )}

          {message.status === 'sent' && (
            <div className="mt-4">
              <LlamabookSpinner size={28} variant={spinnerVariant} spinning={false} className="text-llama-accent" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
