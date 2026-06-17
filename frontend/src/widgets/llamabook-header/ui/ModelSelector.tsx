import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { availableModels } from '@/entities/llamabook-model'
import { IconChevron, IconCheck } from '@/shared/ui/icons'
import './ModelSelector.css'

export function ModelSelector() {
  const { t } = useTranslation()
  const {
    currentModel,
    modelPopupOpen,
    openModelPopup,
    closeModelPopup,
    selectModel,
  } = useLlamabookDashboard()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!modelPopupOpen) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeModelPopup()
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [modelPopupOpen, closeModelPopup])

  return (
    <div className="h-center" ref={ref}>
      <button
        className={clsx('model-sel', modelPopupOpen && 'open')}
        onClick={() => (modelPopupOpen ? closeModelPopup() : openModelPopup())}
        aria-label={t('dashboard.header.modelSelector')}
      >
        <span className="model-dot" style={{ background: currentModel.dotColor }} />
        <span>{currentModel.name}</span>
        <IconChevron />
      </button>

      <div className={clsx('model-popup', modelPopupOpen && 'open')}>
        <div className="model-popup-label">{t('dashboard.header.modelPopup.label')}</div>
        {availableModels.map((model) => (
          <button
            key={model.id}
            className={clsx('model-popup-item', currentModel.id === model.id && 'active')}
            onClick={(e) => {
              e.stopPropagation()
              selectModel(model)
            }}
          >
            <div className="model-popup-icon" style={{ background: model.gradient }}>
              {model.name[0]}
            </div>
            <div className="model-popup-item-text">
              <div className="model-popup-item-name">{model.name}</div>
              <div className="model-popup-item-desc">
                {t(`dashboard.header.models.${model.id}.desc`)}
              </div>
            </div>
            <div className="model-popup-item-check">
              <IconCheck />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
