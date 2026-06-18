import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { newAgentAvatars, newNotebookColors } from '@/widgets/llamabook-sidebar'
import { IconClose, IconPlus, IconLightbulb, IconWorkspace, IconFileUpload } from '@/shared/ui/icons'

export function CreateAgentModal() {
  const { t } = useTranslation()
  const { createAgentModalOpen, closeCreateAgentModal, addAgent } = useLlamabookDashboard()
  const nameRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [context, setContext] = useState('')
  const [uploadedName, setUploadedName] = useState('')
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [colorIndex, setColorIndex] = useState(0)

  useEffect(() => {
    if (!createAgentModalOpen) return
    setName('')
    setDescription('')
    setContext('')
    setUploadedName('')
    setAvatarIndex(Math.floor(Math.random() * newAgentAvatars.length))
    setColorIndex(Math.floor(Math.random() * newNotebookColors.length))
    setTimeout(() => nameRef.current?.focus(), 0)
  }, [createAgentModalOpen])

  const readTextFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      setContext(text)
      setUploadedName(file.name)
    }
    reader.readAsText(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    readTextFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    readTextFile(file)
  }

  const handleSubmit = () => {
    const trimmedName = name.trim()
    if (!trimmedName) return
    addAgent({
      name: trimmedName,
      description: description.trim(),
      avatar: newAgentAvatars[avatarIndex],
      color: newNotebookColors[colorIndex],
      context: context.trim(),
    })
    closeCreateAgentModal()
    setName('')
    setDescription('')
    setContext('')
    setUploadedName('')
  }


  if (!createAgentModalOpen) return null

  const disabled = !name.trim()

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeCreateAgentModal()
      }}
    >
      <div className="w-full max-w-[440px] bg-llama-surface-2 border border-llama-border-2 rounded-2xl shadow-[0_16px_60px_rgba(0,0,0,0.5)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-medium text-llama-fg">{t('dashboard.createAgent.title')}</h2>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md text-llama-fg-3 hover:bg-llama-surface"
            onClick={closeCreateAgentModal}
            aria-label={t('dashboard.createAgent.close')}
          >
            <IconClose className="w-4 h-4 stroke-2" />
          </button>
        </div>

        <label className="block text-[13px] text-llama-fg-2 mb-2">{t('dashboard.createAgent.nameLabel')}</label>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-llama-surface border border-llama-border mb-3 focus-within:border-llama-border-2">
          <IconWorkspace className="w-4 h-4 text-llama-fg-5 stroke-[1.8]" />
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={t('dashboard.createAgent.namePlaceholder')}
            className="flex-1 min-w-0 bg-transparent border-0 text-[14px] text-llama-fg outline-none placeholder:text-llama-fg-5"
          />
        </div>

        <label className="block text-[13px] text-llama-fg-2 mb-2">{t('dashboard.createAgent.descriptionLabel')}</label>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-llama-surface border border-llama-border mb-3 focus-within:border-llama-border-2">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('dashboard.createAgent.descriptionPlaceholder')}
            className="flex-1 min-w-0 bg-transparent border-0 text-[14px] text-llama-fg outline-none placeholder:text-llama-fg-5"
          />
        </div>

        <label className="block text-[13px] text-llama-fg-2 mb-2">{t('dashboard.createAgent.contextLabel')}</label>
        <div
          className="relative w-full mb-2"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder={t('dashboard.createAgent.contextPlaceholder')}
            rows={4}
            className="w-full px-3 py-2.5 rounded-xl bg-llama-surface border border-llama-border text-[14px] text-llama-fg outline-none placeholder:text-llama-fg-5 focus:border-llama-border-2 resize-none"
          />
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.json,.yaml,.yml,.csv,.xml,.html,.css,.js,.ts,.tsx,.py,.sh,.sql,.log,.env,.ini,.toml,.rst"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute right-2 bottom-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-llama-surface-2 border border-llama-border text-[11px] text-llama-fg-3 hover:text-llama-fg hover:border-llama-border-2 transition-colors duration-100"
          >
            <IconFileUpload className="w-3.5 h-3.5" />
            {uploadedName ? uploadedName : t('dashboard.createAgent.upload')}
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-4">
          <div>
            <span className="block text-[12px] text-llama-fg-3 mb-1.5">Avatar</span>
            <div className="flex items-center gap-1 flex-wrap">
              {newAgentAvatars.map((avatar, idx) => (
                <button
                  key={avatar}
                  type="button"
                  className={clsx(
                    'w-7 h-7 rounded-md text-[13px] transition-colors duration-100',
                    idx === avatarIndex
                      ? 'bg-llama-fg text-llama-bg'
                      : 'bg-llama-surface hover:bg-llama-surface-2'
                  )}
                  onClick={() => setAvatarIndex(idx)}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-[12px] text-llama-fg-3 mb-1.5">Color</span>
            <div className="flex items-center gap-1 flex-wrap">
              {newNotebookColors.map((color, idx) => (
                <button
                  key={color}
                  type="button"
                  className={clsx(
                    'w-7 h-7 rounded-md transition-all duration-100',
                    idx === colorIndex ? 'ring-2 ring-llama-fg ring-offset-1 ring-offset-llama-surface-2' : 'hover:scale-105'
                  )}
                  style={{ background: color }}
                  onClick={() => setColorIndex(idx)}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-llama-surface/50 border border-llama-border mb-5">
          <IconLightbulb className="w-4 h-4 text-llama-fg-4 shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-llama-fg-4 leading-relaxed">{t('dashboard.createAgent.hint')}</p>
        </div>

        <button
          className={clsx(
            'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors duration-150',
            disabled
              ? 'bg-white/[0.10] text-llama-fg-3 cursor-default'
              : 'bg-llama-fg text-llama-bg hover:bg-llama-fg-2'
          )}
          disabled={disabled}
          onClick={handleSubmit}
        >
          <IconPlus className="w-4 h-4 stroke-2" />
          {t('dashboard.createAgent.create')}
        </button>
      </div>
    </div>
  )
}
