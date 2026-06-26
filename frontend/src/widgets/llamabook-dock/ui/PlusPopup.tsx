import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { iconsByToolId, iconsByActionId, IconCheck } from '@/shared/ui/icons'
import { attachItems, toolItems } from '../model/data'
import { toolColors, toolIconBackgrounds } from '../model/consts'

interface PlusPopupProps {
  open: boolean
  onClose: () => void
}

const iconColorByAction: Record<string, string> = {
  upload: 'text-llama-fg-3 bg-white/[0.10]',
  link: 'text-[#818cf8] bg-[rgba(99,102,241,0.1)]',
}

export function PlusPopup({ open, onClose }: PlusPopupProps) {
  const { t } = useTranslation()
  const { activeTools, toggleTool, attachFile, addPendingImage } = useLlamabookDashboard()
  const ref = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [open, onClose])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          addPendingImage(file)
        }
      }
    }
    e.target.value = ''
    onClose()
  }

  return (
    <div
      ref={ref}
      className={clsx(
        'plus-popup absolute bottom-[calc(100%+8px)] left-0 w-[calc(100vw-32px)] sm:w-[300px] max-w-[340px] bg-llama-surface-2 border border-llama-border-2 rounded-xl p-1.5 z-50',
        'max-h-[420px] overflow-y-auto opacity-0 transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_8px_30px_rgba(0,0,0,0.4)] origin-bottom-left',
        open && 'opacity-100 pointer-events-auto scale-100 translate-y-0',
        !open && 'pointer-events-none scale-[0.97] translate-y-1.5'
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="plus-popup-section mb-0.5">
        <div className="plus-popup-label text-[10.5px] font-medium text-llama-fg-5 px-2.5 pt-1.5 pb-1 tracking-wide uppercase">
          {t('dashboard.dock.attachSection.title')}
        </div>
        {attachItems.map((item) => {
          const Icon = iconsByActionId[item.id]
          return (
            <button
              key={item.id}
              className="plus-popup-item flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] font-normal text-llama-fg-2 text-left transition-colors duration-100 cursor-pointer hover:bg-white/[0.06] hover:text-llama-fg"
              onClick={(e) => {
                e.stopPropagation()
                if (item.id === 'upload') {
                  fileInputRef.current?.click()
                } else if (item.id === 'link') {
                  attachFile()
                }
                onClose()
              }}
            >
              <div className={clsx('plus-popup-icon w-[30px] h-[30px] rounded-lg flex items-center justify-center shrink-0', iconColorByAction[item.id])}>
                <Icon className="w-4 h-4 stroke-2" />
              </div>
              <div className="plus-popup-item-text flex-1 min-w-0">
                <div className="plus-popup-item-title text-[13px] font-normal leading-tight">
                  {t(`dashboard.dock.attachSection.${item.id}`)}
                </div>
                <div className="plus-popup-item-desc text-[11px] text-llama-fg-4 font-light leading-tight mt-px">
                  {t(`dashboard.dock.attachSection.${item.id}Desc`)}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="plus-popup-sep h-px bg-llama-border my-1 mx-2.5" />

      <div className="plus-popup-section mb-0.5">
        <div className="plus-popup-label text-[10.5px] font-medium text-llama-fg-5 px-2.5 pt-1.5 pb-1 tracking-wide uppercase">
          {t('dashboard.dock.toolsSection.title')}
        </div>
        {toolItems.map((item) => {
          const Icon = iconsByToolId[item.id]
          const isActive = !item.comingSoon && activeTools.has(item.id)
          return (
            <button
              key={item.id}
              className={clsx(
                'plus-popup-item flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] font-normal text-left transition-colors duration-100',
                item.comingSoon
                  ? 'cursor-default opacity-50'
                  : 'cursor-pointer hover:bg-white/[0.06] hover:text-llama-fg text-llama-fg-2'
              )}
              onClick={(e) => {
                e.stopPropagation()
                if (item.comingSoon) return
                toggleTool(item.id)
              }}
              disabled={item.comingSoon}
            >
              <div
                className="plus-popup-icon w-[30px] h-[30px] rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: toolIconBackgrounds[item.id],
                  color: toolColors[item.id],
                }}
              >
                <Icon className="w-4 h-4 stroke-2" />
              </div>
              <div className="plus-popup-item-text flex-1 min-w-0">
                <div className="plus-popup-item-title text-[13px] font-normal leading-tight">
                  {t(`dashboard.dock.tools.${item.id}`)}
                </div>
                <div className="plus-popup-item-desc text-[11px] text-llama-fg-4 font-light leading-tight mt-px">
                  {t(`dashboard.dock.tools.${item.id}Desc`)}
                </div>
              </div>
              {item.comingSoon ? (
                <span className="plus-popup-soon text-[9.5px] font-medium uppercase tracking-wide text-llama-fg-4 px-1.5 py-0.5 rounded bg-white/[0.06] shrink-0">
                  {t('dashboard.dock.tools.comingSoon')}
                </span>
              ) : (
                <div
                  className={clsx(
                    'plus-popup-item-check w-4 h-4 rounded border-[1.5px] border-llama-border-2 flex items-center justify-center shrink-0 transition-colors duration-150',
                    isActive && 'bg-llama-accent border-llama-accent'
                  )}
                >
                  <IconCheck className={clsx('w-2.5 h-2.5 stroke-white stroke-[3] opacity-0 transition-opacity duration-100', isActive && 'opacity-100')} />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
