import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconClose, IconFolder, IconPlus, IconLightbulb } from '@/shared/ui/icons'

export function CreateNotebookModal() {
  const { t } = useTranslation()
  const { createNotebookModalOpen, closeCreateNotebookModal, addNotebook } = useLlamabookDashboard()
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')

  useEffect(() => {
    if (!createNotebookModalOpen) return
    setName('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [createNotebookModalOpen])

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    addNotebook(trimmed)
    closeCreateNotebookModal()
    setName('')
  }

  if (!createNotebookModalOpen) return null

  const disabled = !name.trim()

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeCreateNotebookModal()
      }}
    >
      <div className="w-full max-w-[440px] bg-llama-surface-2 border border-llama-border-2 rounded-2xl shadow-[0_16px_60px_rgba(0,0,0,0.5)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-medium text-llama-fg">{t('dashboard.createNotebook.title')}</h2>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md text-llama-fg-3 hover:bg-llama-surface"
            onClick={closeCreateNotebookModal}
            aria-label={t('dashboard.createNotebook.close')}
          >
            <IconClose className="w-4 h-4 stroke-2" />
          </button>
        </div>

        <label className="block text-[13px] text-llama-fg-2 mb-2">{t('dashboard.createNotebook.nameLabel')}</label>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-llama-surface border border-llama-border mb-4 focus-within:border-llama-border-2">
          <IconFolder className="w-4 h-4 text-llama-fg-5 stroke-[1.8]" />
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={t('dashboard.createNotebook.placeholder')}
            className="flex-1 min-w-0 bg-transparent border-0 text-[14px] text-llama-fg outline-none placeholder:text-llama-fg-5"
          />
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-llama-surface/50 border border-llama-border mb-5">
          <IconLightbulb className="w-4 h-4 text-llama-fg-4 shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-llama-fg-4 leading-relaxed">{t('dashboard.createNotebook.hint')}</p>
        </div>

        <button
          className={clsx(
            'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors duration-150',
            disabled
              ? 'bg-white/[0.06] text-llama-fg-5 cursor-default'
              : 'bg-llama-fg text-llama-bg hover:bg-llama-fg-2'
          )}
          disabled={disabled}
          onClick={handleSubmit}
        >
          <IconPlus className="w-4 h-4 stroke-2" />
          {t('dashboard.createNotebook.create')}
        </button>
      </div>
    </div>
  )
}
