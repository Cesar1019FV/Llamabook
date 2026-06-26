import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconPlus, IconMic, IconSend, IconStop } from '@/shared/ui/icons'
import { PlusPopup } from './PlusPopup'
import { ThinkToggle } from './ThinkToggle'
import { WebSearchToggle } from './WebSearchToggle'
import { ImagePreviewStrip } from './ImagePreviewStrip'

export function DockInput() {
  const { t } = useTranslation()
  const {
    sendMessage,
    attachedFiles,
    pendingImages,
    addPendingImage,
    plusPopupOpen,
    openPlusPopup,
    closePlusPopup,
    closeModelPopup,
    currentView,
    isGenerating,
    stopGeneration,
  } = useLlamabookDashboard()
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const hasUploadingImages = pendingImages.some((img) => img.uploading)
  const hasContent = text.trim() || attachedFiles.length > 0 || pendingImages.length > 0
  const disabled = !hasContent || hasUploadingImages

  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  useEffect(() => {
    resize()
  }, [text])

  useEffect(() => {
    if (currentView === 'chat') {
      setTimeout(() => textareaRef.current?.focus(), 0)
    }
  }, [currentView])

  const handleSend = () => {
    if (disabled) return
    sendMessage(text)
    setText('')
    const el = textareaRef.current
    if (el) el.style.height = 'auto'
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.files
    if (!items || items.length === 0) return
    let hasImage = false
    for (const file of Array.from(items)) {
      if (file.type.startsWith('image/')) {
        addPendingImage(file)
        hasImage = true
      }
    }
    if (hasImage) e.preventDefault()
  }

  return (
    <div className="relative">
      <div className="dock-row flex flex-col min-h-[100px] py-3 px-3 rounded-2xl bg-llama-surface border border-llama-border transition-colors duration-150 focus-within:border-white/[0.18]">
        <ImagePreviewStrip />

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
            if (e.key === 'Escape' && isGenerating) {
              e.preventDefault()
              stopGeneration()
            }
          }}
          onPaste={handlePaste}
          onFocus={() => {
            closePlusPopup()
            closeModelPopup()
          }}
          placeholder={t('dashboard.dock.inputPlaceholder')}
          aria-label={t('dashboard.dock.inputLabel')}
          className="w-full flex-1 min-h-0 border-0 bg-transparent text-llama-fg font-sans text-[14px] font-normal resize-none max-h-[120px] outline-none leading-normal placeholder:text-llama-fg-4"
        />

        <div className="flex items-center justify-between mt-2 shrink-0">
          <button
            id="btn-plus"
            className={clsx(
              'dock-plus w-[34px] h-[34px] flex items-center justify-center rounded-lg text-llama-fg-3 transition-all duration-150 shrink-0',
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

          <div className="flex items-center gap-1.5">
            <ThinkToggle />
            <WebSearchToggle />
            <button
              className="d-btn w-8 h-8 flex items-center justify-center rounded-lg text-llama-fg-4 transition-colors duration-150 hover:bg-white/[0.10] hover:text-llama-fg-2"
              aria-label={t('dashboard.dock.mic')}
            >
              <IconMic className="w-4 h-4 stroke-[1.8]" />
            </button>
            {isGenerating ? (
              <button
                className="d-btn stop w-8 h-8 flex items-center justify-center rounded-lg bg-llama-fg text-llama-bg transition-colors duration-150 hover:bg-llama-fg-2"
                onClick={stopGeneration}
                aria-label={t('dashboard.dock.stop')}
                title={t('dashboard.dock.stop')}
              >
                <IconStop className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                className={clsx(
                  'd-btn send w-8 h-8 flex items-center justify-center rounded-lg text-white transition-colors duration-150',
                  disabled
                    ? 'bg-white/[0.10] text-llama-fg-3 cursor-default'
                    : 'bg-llama-accent hover:bg-llama-accent-light'
                )}
                disabled={disabled}
                onClick={handleSend}
                aria-label={t('dashboard.dock.send')}
              >
                <IconSend className="w-4 h-4 stroke-[1.8]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <PlusPopup open={plusPopupOpen} onClose={closePlusPopup} />
    </div>
  )
}
