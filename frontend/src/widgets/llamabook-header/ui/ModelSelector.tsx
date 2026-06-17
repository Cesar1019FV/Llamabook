import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { availableModels } from '@/entities/llamabook-model'
import { IconChevron, IconCheck, IconSearch } from '@/shared/ui/icons'

type ModelTab = 'all' | 'external'

export function ModelSelector() {
  const { t } = useTranslation()
  const {
    currentModel,
    modelPopupOpen,
    openModelPopup,
    closeModelPopup,
    selectModel,
    modelSearchQuery,
    setModelSearchQuery,
  } = useLlamabookDashboard()
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<ModelTab>('all')

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

  useEffect(() => {
    if (modelPopupOpen) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [modelPopupOpen])

  const filteredModels = availableModels.filter((model) => {
    const matchesTab = activeTab === 'all' || model.provider === activeTab
    const matchesSearch = model.name.toLowerCase().includes(modelSearchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const hasExternalModels = availableModels.some((m) => m.provider === 'external')
  const isEmpty = filteredModels.length === 0

  return (
    <div className="h-center flex-1 flex items-center justify-center min-w-0" ref={ref}>
      <button
        className={clsx(
          'model-sel flex items-center gap-[5px] py-1 px-2.5 rounded-md text-[13px] font-normal text-llama-fg-2 transition-colors duration-150 cursor-pointer relative',
          'hover:bg-llama-surface hover:text-llama-fg',
          modelPopupOpen && 'open'
        )}
        onClick={() => (modelPopupOpen ? closeModelPopup() : openModelPopup())}
        aria-label={t('dashboard.header.modelSelector')}
      >
        <span
          className="model-dot w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: currentModel.dotColor }}
        />
        <span className="whitespace-nowrap">{currentModel.name}</span>
        <IconChevron className="w-3 h-3 stroke-[2.5] transition-transform duration-150 [[open]_&]:rotate-180" />
      </button>

      <div
        className={clsx(
          'model-popup absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] sm:w-[320px] max-w-[340px] bg-llama-surface-2 border border-llama-border-2 rounded-xl p-2 z-[60]',
          'opacity-0 pointer-events-none transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_8px_30px_rgba(0,0,0,0.4)]',
          modelPopupOpen && 'opacity-100 pointer-events-auto translate-y-0',
          !modelPopupOpen && 'translate-y-1'
        )}
      >
        <div className="model-popup-label text-[10.5px] font-medium text-llama-fg-5 px-2 pt-1.5 pb-1 tracking-wide uppercase">
          {t('dashboard.header.modelPopup.label')}
        </div>

        <div className="px-2 pb-2">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-llama-surface border border-llama-border">
            <IconSearch className="w-4 h-4 text-llama-fg-5 stroke-[1.8] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={modelSearchQuery}
              onChange={(e) => setModelSearchQuery(e.target.value)}
              placeholder={t('dashboard.header.modelSearchPlaceholder')}
              className="flex-1 min-w-0 bg-transparent border-0 text-[13px] text-llama-fg-2 placeholder:text-llama-fg-5 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 pb-2">
          <button
            className={clsx(
              'px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors duration-150',
              activeTab === 'all' ? 'bg-llama-surface text-llama-fg' : 'text-llama-fg-4 hover:text-llama-fg-2'
            )}
            onClick={() => setActiveTab('all')}
          >
            {t('dashboard.header.modelTabs.all')}
          </button>
          <button
            className={clsx(
              'px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors duration-150',
              activeTab === 'external' ? 'bg-llama-surface text-llama-fg' : 'text-llama-fg-4 hover:text-llama-fg-2',
              !hasExternalModels && 'opacity-50 cursor-default'
            )}
            onClick={() => hasExternalModels && setActiveTab('external')}
            disabled={!hasExternalModels}
          >
            {t('dashboard.header.modelTabs.external')}
          </button>
        </div>

        <div className="max-h-[320px] overflow-y-auto">
          {isEmpty ? (
            <div className="px-2.5 py-4 text-center">
              <p className="text-[12.5px] text-llama-fg-5">
                {modelSearchQuery
                  ? t('dashboard.header.modelSearchEmpty', { query: modelSearchQuery })
                  : t('dashboard.header.modelEmpty')}
              </p>
            </div>
          ) : (
            filteredModels.map((model) => (
              <button
                key={model.id}
                className={clsx(
                  'model-popup-item flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] font-normal text-llama-fg-2 text-left transition-colors duration-100 cursor-pointer',
                  'hover:bg-white/[0.06] hover:text-llama-fg',
                  currentModel.id === model.id && 'bg-llama-accent/8 text-llama-fg active'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  selectModel(model)
                }}
              >
                <div
                  className="model-popup-icon w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0 text-[12px] font-semibold text-white"
                  style={{ background: model.gradient }}
                >
                  {model.name[0].toUpperCase()}
                </div>
                <div className="model-popup-item-text flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="model-popup-item-name text-[13px] font-medium leading-tight">{model.name}</span>
                    {model.provider === 'local' && (
                      <span className="text-[9.5px] font-medium text-llama-fg-3 px-1 py-px rounded bg-white/[0.10]">
                        {t('dashboard.header.modelProvider.local')}
                      </span>
                    )}
                  </div>
                  <div className="model-popup-item-desc text-[11px] text-llama-fg-3 font-normal leading-tight mt-px">
                    {model.desc}
                  </div>
                </div>
                <div
                  className={clsx(
                    'model-popup-item-check w-3.5 h-3.5 rounded-full bg-llama-accent hidden items-center justify-center shrink-0',
                    currentModel.id === model.id && 'flex'
                  )}
                >
                  <IconCheck className="w-2 h-2 stroke-white stroke-[3]" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
