import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconFolder, IconPlus, IconSend, IconFileUpload } from '@/shared/ui/icons'

export function NotebookView() {
  const { t } = useTranslation()
  const {
    notebooks,
    currentNotebookId,
    showDashboard,
    openChat,
    updateNotebookContext,
  } = useLlamabookDashboard()
  const [activeTab, setActiveTab] = useState<'chats' | 'context'>('chats')
  const [contextDraft, setContextDraft] = useState('')
  const [uploadedName, setUploadedName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const notebook = notebooks.find((n) => n.id === currentNotebookId)

  const readTextFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      setContextDraft((prev) => (prev ? prev + '\n\n' : '') + text)
      setUploadedName(file.name)
    }
    reader.readAsText(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) readTextFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) readTextFile(file)
  }

  if (!notebook) {
    return (
      <div className="max-w-[780px] mx-auto px-[18px] py-6 md:px-7 md:py-9">
        <p className="text-llama-fg-4">{t('dashboard.notebookDetail.notFound')}</p>
      </div>
    )
  }

  const hasChats = notebook.chats.length > 0

  return (
    <div className="max-w-[780px] mx-auto px-[18px] py-6 pb-[60px] md:px-7 md:py-9">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-semibold text-white shrink-0"
            style={{ background: notebook.color }}
          >
            {notebook.name[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-xl font-normal text-llama-fg truncate">{notebook.name}</h1>
            <p className="text-[12px] text-llama-fg-4">
              {notebook.chats.length} {t('dashboard.notebookDetail.chatsCount', { count: notebook.chats.length })}
            </p>
          </div>
        </div>

        <button
          className="px-3 py-1.5 rounded-lg border border-llama-border text-[12.5px] text-llama-fg-2 transition-colors duration-150 hover:bg-llama-surface"
          onClick={showDashboard}
        >
          {t('dashboard.notebookDetail.back')}
        </button>
      </div>

      <div className="flex items-center gap-1 mb-3">
        <button
          className={clsx(
            'px-3 py-1.5 rounded-md text-[12.5px] font-medium',
            activeTab === 'chats'
              ? 'bg-llama-surface text-llama-fg'
              : 'text-llama-fg-4 hover:text-llama-fg-2'
          )}
          onClick={() => setActiveTab('chats')}
        >
          {t('dashboard.notebookDetail.tabs.chats')}
        </button>
        <button
          className={clsx(
            'px-3 py-1.5 rounded-md text-[12.5px] font-medium',
            activeTab === 'context'
              ? 'bg-llama-surface text-llama-fg'
              : 'text-llama-fg-4 hover:text-llama-fg-2'
          )}
          onClick={() => {
            setActiveTab('context')
            setContextDraft(notebook.context)
          }}
        >
          {t('dashboard.notebookDetail.tabs.context')}
        </button>
      </div>

      {activeTab === 'chats' ? (
        <>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 mb-6 rounded-xl bg-llama-surface border border-llama-border text-[14px] text-llama-fg-3 text-left transition-colors duration-150 hover:bg-llama-surface-2 hover:border-llama-border-2"
            onClick={() => openChat('new')}
          >
            <IconPlus className="w-4 h-4 stroke-2" />
            {t('dashboard.notebookDetail.newChat', { name: notebook.name })}
            <IconSend className="w-4 h-4 stroke-2 ml-auto" />
          </button>

          {hasChats ? (
            <div className="space-y-1">
              {notebook.chats.map((chat, idx) => (
                <div
                  key={`${notebook.id}-${idx}`}
                  className={clsx(
                    'w-full flex items-center justify-between px-3 py-3 rounded-lg text-left border border-transparent'
                  )}
                >
                  <div className="min-w-0">
                    <div className="text-[13.5px] text-llama-fg-2 truncate">{chat}</div>
                  </div>
                  <span className="text-[11px] text-llama-fg-5 shrink-0">{t('dashboard.notebookDetail.recently')}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-llama-border rounded-xl">
              <div className="w-12 h-12 rounded-full bg-llama-surface flex items-center justify-center mb-4">
                <IconFolder className="w-6 h-6 text-llama-fg-4" />
              </div>
              <h3 className="text-[15px] font-medium text-llama-fg mb-1">{t('dashboard.notebookDetail.empty.title')}</h3>
              <p className="text-[13px] text-llama-fg-4 max-w-[280px]">{t('dashboard.notebookDetail.empty.description', { name: notebook.name })}</p>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <label className="block text-[13px] text-llama-fg-2">{t('dashboard.notebookDetail.context.title')}</label>
          <div
            className="relative w-full"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <textarea
              value={contextDraft}
              onChange={(e) => setContextDraft(e.target.value)}
              rows={14}
              placeholder={t('dashboard.notebookDetail.context.placeholder')}
              className="w-full px-3 py-2.5 rounded-xl bg-llama-surface border border-llama-border text-[14px] text-llama-fg-2 outline-none placeholder:text-llama-fg-5 focus:border-llama-border-2 resize-none"
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
              {uploadedName ? uploadedName : t('dashboard.notebookDetail.context.upload')}
            </button>
          </div>
          <button
            className="px-4 py-2 rounded-lg bg-llama-fg text-llama-bg text-[13px] font-medium transition-colors duration-150 hover:bg-llama-fg-2"
            onClick={() => updateNotebookContext(notebook.id, contextDraft)}
          >
            {t('dashboard.notebookDetail.context.save')}
          </button>
        </div>
      )}
    </div>
  )
}
