import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
    <div className="dock">
      <div className="dock-inner">
        <button
          className={['dock-plus', plusPopupOpen ? 'active' : ''].filter(Boolean).join(' ')}
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
          <IconPlus />
        </button>

        <div className="dock-row">
          <textarea
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
            className="msg-input"
          />
          <div className="dock-sep" />
          <div className="dock-btns">
            <button className="d-btn" aria-label={t('dashboard.dock.mic')}>
              <IconMic />
            </button>
            <button
              className="d-btn send"
              disabled={disabled}
              onClick={handleSend}
              aria-label={t('dashboard.dock.send')}
            >
              <IconSend />
            </button>
          </div>
        </div>

        <PlusPopup open={plusPopupOpen} onClose={closePlusPopup} />
      </div>
    </div>
  )
}
