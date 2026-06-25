import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard, type ThinkMode } from '@/app/providers'
import { IconThinking, IconChevron, IconCheck } from '@/shared/ui/icons'

const EFFORT_MODES: ThinkMode[] = ['on', 'low', 'medium', 'high']

export function ThinkToggle() {
  const { t } = useTranslation()
  const { thinkMode, setThinkMode, closePlusPopup, closeModelPopup } = useLlamabookDashboard()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const lastActiveRef = useRef<ThinkMode>(thinkMode === 'off' ? 'on' : thinkMode)

  useEffect(() => {
    if (thinkMode !== 'off') lastActiveRef.current = thinkMode
  }, [thinkMode])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [open])

  const isOff = thinkMode === 'off'

  const handleToggle = () => {
    if (isOff) setThinkMode(lastActiveRef.current)
    else setThinkMode('off')
  }

  const effortLabel = isOff ? '' : t(`dashboard.dock.think.${thinkMode}`)

  return (
    <div ref={ref} className="relative flex items-center">
      <button
        type="button"
        className={clsx(
          'dock-think-toggle flex items-center gap-1 h-[30px] px-2 rounded-lg text-[12px] font-medium transition-all duration-150 shrink-0',
          isOff
            ? 'text-llama-fg-4 hover:bg-white/[0.06] hover:text-llama-fg-3'
            : 'text-llama-fg-2 bg-white/[0.06] hover:bg-white/[0.10]'
        )}
        onClick={(e) => {
          e.stopPropagation()
          closePlusPopup()
          closeModelPopup()
          handleToggle()
        }}
        aria-label={t('dashboard.dock.think.label')}
        title={isOff ? t('dashboard.dock.think.offDesc') : t(`dashboard.dock.think.${thinkMode}Desc`)}
      >
        <IconThinking className={clsx('w-[14px] h-[14px] shrink-0', !isOff && 'text-llama-accent')} />
        {!isOff && <span className="whitespace-nowrap text-[11px]">{effortLabel}</span>}
      </button>

      <button
        type="button"
        className={clsx(
          'dock-think-chevron w-[18px] h-[30px] flex items-center justify-center rounded-r shrink-0 transition-colors duration-150',
          isOff ? 'text-llama-fg-5 hover:text-llama-fg-3' : 'text-llama-fg-3 hover:text-llama-fg'
        )}
        onClick={(e) => {
          e.stopPropagation()
          closePlusPopup()
          closeModelPopup()
          setOpen((v) => !v)
        }}
        aria-label={t('dashboard.dock.think.effort')}
      >
        <IconChevron className={clsx('w-3 h-3 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className="think-popup absolute bottom-[calc(100%+8px)] right-0 w-[240px] bg-llama-surface-2 border border-llama-border-2 rounded-xl p-1.5 z-50 shadow-[0_8px_30px_rgba(0,0,0,0.4)] origin-bottom-right"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="think-popup-label text-[10.5px] font-medium text-llama-fg-5 px-2.5 pt-1.5 pb-1 tracking-wide uppercase">
            {t('dashboard.dock.think.effort')}
          </div>
          {EFFORT_MODES.map((mode) => {
            const isActive = thinkMode === mode
            return (
              <button
                key={mode}
                className="think-popup-item flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] font-normal text-left transition-colors duration-100 cursor-pointer hover:bg-white/[0.06] hover:text-llama-fg text-llama-fg-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setThinkMode(mode)
                  setOpen(false)
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-normal leading-tight">
                    {t(`dashboard.dock.think.${mode}`)}
                  </div>
                  <div className="text-[11px] text-llama-fg-4 font-light leading-tight mt-px">
                    {t(`dashboard.dock.think.${mode}Desc`)}
                  </div>
                </div>
                {isActive && (
                  <IconCheck className="w-3.5 h-3.5 stroke-llama-accent stroke-[2.5] shrink-0" />
                )}
              </button>
            )
          })}
          <div className="think-popup-disclaimer flex items-start gap-1.5 px-2.5 pt-2 pb-1 mt-1 border-t border-llama-border">
            <span className="text-[10px] text-llama-fg-5 leading-snug">
              {t('dashboard.dock.think.disclaimer')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}