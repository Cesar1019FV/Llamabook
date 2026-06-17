import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconPlus, IconMic, IconSend } from '@/shared/ui/icons'
import { PlusPopup } from './PlusPopup'

export function DockInput() {
  const { t } = useTranslation()
  const {
    sendMessage,
    attachedFiles,
    plusPopupOpen,
    openPlusPopup,
    closePlusPopup,
    closeModelPopup,
  } = useLlamabookDashboard()
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const disabled = !text.trim() && attachedFiles.length === 0

  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  useEffect(() => {
    resize()
  }, [text])

  const handleSend = () => {
    if (disabled) return
    sendMessage(text)
    setText('')
    const el = textareaRef.current
    if (el) el.style.height = 'auto'
  }

  return (
    <div className="relative">
      <div className="dock-row flex items-end min-h-12 py-2 pl-2 pr-3.5 rounded-2xl bg-llama-surface border border-llama-border transition-colors duration-150 gap-1 focus-within:border-white/[0.18]">
        <button
          id="btn-plus"
          className={clsx(
            'dock-plus w-[34px] h-[34px] flex items-center justify-center rounded-lg text-llama-fg-3 transition-all duration-150 shrink-0 mr-1',
            'hover:bg-white/[0.06] hover:text-llama-fg',
            plusPopupOpen && 'bg-white/[0.08] text-llama-fg'
          )}
          onClick={(e) => {
            e.stopPropagation()
            if (plusPopupOpen) closePlusPopup()
            else {
              closeModelPopup()
              openPlusPopup()
            }
          }}
          aria-label={t('dashboard.dock.attach')}
        >
          <IconPlus className={clsx('w-5 h-5 stroke-2 transition-transform duration-200', plusPopupOpen && 'rotate-45')} />
        </button>

        <textarea
          id="msg-input"
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          onFocus={() => {
            closePlusPopup()
            closeModelPopup()
          }}
          placeholder={t('dashboard.dock.inputPlaceholder')}
          aria-label={t('dashboard.dock.inputLabel')}
          className="flex-1 min-w-0 border-0 bg-transparent text-llama-fg font-sans text-[14px] font-normal resize-none max-h-[120px] outline-none leading-normal self-center placeholder:text-llama-fg-4"
        />

        <div className="dock-sep w-px h-5 bg-llama-border shrink-0 mx-1" />

        <div className="dock-btns flex items-center gap-0.5 shrink-0">
          <button
            className="d-btn w-8 h-8 flex items-center justify-center rounded-lg text-llama-fg-4 transition-colors duration-150 hover:bg-white/[0.05] hover:text-llama-fg-2"
            aria-label={t('dashboard.dock.mic')}
          >
            <IconMic className="w-4 h-4 stroke-[1.8]" />
          </button>
          <button
            className={clsx(
              'd-btn send w-8 h-8 flex items-center justify-center rounded-lg text-white transition-colors duration-150',
              disabled
                ? 'bg-white/[0.06] text-llama-fg-4 cursor-default'
                : 'bg-llama-accent hover:bg-llama-accent-light'
            )}
            disabled={disabled}
            onClick={handleSend}
            aria-label={t('dashboard.dock.send')}
          >
            <IconSend className="w-4 h-4 stroke-[1.8]" />
          </button>
        </div>
      </div>

      <PlusPopup open={plusPopupOpen} onClose={closePlusPopup} />
    </div>
  )
}
