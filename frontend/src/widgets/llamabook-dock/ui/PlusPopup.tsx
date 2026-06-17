import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { iconsByToolId, iconsByActionId, IconCheck } from '@/shared/ui/icons'
import { attachItems, toolItems } from '../model/data'
import { toolColors, toolIconBackgrounds } from '../model/consts'
import './PlusPopup.css'

interface PlusPopupProps {
  open: boolean
  onClose: () => void
}

export function PlusPopup({ open, onClose }: PlusPopupProps) {
  const { t } = useTranslation()
  const { activeTools, toggleTool, attachFile } = useLlamabookDashboard()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open, onClose])

  return (
    <div ref={ref} className={clsx('plus-popup', open && 'open')}>
      <div className="plus-popup-section">
        <div className="plus-popup-label">{t('dashboard.dock.attachSection.title')}</div>
        {attachItems.map((item) => {
          const Icon = iconsByActionId[item.id]
          return (
            <button
              key={item.id}
              className="plus-popup-item"
              onClick={(e) => {
                e.stopPropagation()
                if (item.id === 'upload') attachFile()
                onClose()
              }}
            >
              <div className={clsx('plus-popup-icon', item.id)}>
                <Icon />
              </div>
              <div className="plus-popup-item-text">
                <div className="plus-popup-item-title">
                  {t(`dashboard.dock.attachSection.${item.id}`)}
                </div>
                <div className="plus-popup-item-desc">
                  {t(`dashboard.dock.attachSection.${item.id}Desc`)}
                </div>
              </div>
            </button>
          )
        })}
      </div>
      <div className="plus-popup-sep" />
      <div className="plus-popup-section">
        <div className="plus-popup-label">{t('dashboard.dock.toolsSection.title')}</div>
        {toolItems.map((item) => {
          const Icon = iconsByToolId[item.id]
          const isActive = activeTools.has(item.id)
          return (
            <button
              key={item.id}
              className="plus-popup-item"
              onClick={(e) => {
                e.stopPropagation()
                toggleTool(item.id)
              }}
            >
              <div
                className={clsx('plus-popup-icon', item.id)}
                style={{
                  background: toolIconBackgrounds[item.id],
                  color: toolColors[item.id],
                }}
              >
                <Icon />
              </div>
              <div className="plus-popup-item-text">
                <div className="plus-popup-item-title">
                  {t(`dashboard.dock.tools.${item.id}`)}
                </div>
                <div className="plus-popup-item-desc">
                  {t(`dashboard.dock.tools.${item.id}Desc`)}
                </div>
              </div>
              <div className={clsx('plus-popup-item-check', isActive && 'on')}>
                <IconCheck />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
