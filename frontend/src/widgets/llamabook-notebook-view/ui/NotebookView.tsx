import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconFolder, IconPlus, IconSend } from '@/shared/ui/icons'

export function NotebookView() {
  const { t } = useTranslation()
  const {
    notebooks,
    currentNotebookId,
    showDashboard,
    openChat,
  } = useLlamabookDashboard()

  const notebook = notebooks.find((n) => n.id === currentNotebookId)

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

        <div className="flex items-center gap-1.5">
          <button
            className="px-3 py-1.5 rounded-lg border border-llama-border text-[12.5px] text-llama-fg-2 transition-colors duration-150 hover:bg-llama-surface"
            onClick={showDashboard}
          >
            {t('dashboard.notebookDetail.back')}
          </button>
        </div>
      </div>

      <button
        className="w-full flex items-center gap-3 px-4 py-3 mb-6 rounded-xl bg-llama-surface border border-llama-border text-[14px] text-llama-fg-3 text-left transition-colors duration-150 hover:bg-llama-surface-2 hover:border-llama-border-2"
        onClick={() => openChat('new')}
      >
        <IconPlus className="w-4 h-4 stroke-2" />
        {t('dashboard.notebookDetail.newChat', { name: notebook.name })}
        <IconSend className="w-4 h-4 stroke-2 ml-auto" />
      </button>

      <div className="flex items-center gap-1 mb-3">
        <button className="px-3 py-1.5 rounded-md text-[12.5px] font-medium bg-llama-surface text-llama-fg">
          {t('dashboard.notebookDetail.tabs.chats')}
        </button>
        <button className="px-3 py-1.5 rounded-md text-[12.5px] font-medium text-llama-fg-4 hover:text-llama-fg-2">
          {t('dashboard.notebookDetail.tabs.sources')}
        </button>
      </div>

      {hasChats ? (
        <div className="space-y-1">
          {notebook.chats.map((chat, idx) => (
            <button
              key={`${notebook.id}-${idx}`}
              className={clsx(
                'w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-colors duration-100 hover:bg-llama-surface/50 border border-transparent',
                'hover:border-llama-border'
              )}
              onClick={() => openChat(chat)}
            >
              <div className="min-w-0">
                <div className="text-[13.5px] text-llama-fg-2 truncate">{chat}</div>
              </div>
              <span className="text-[11px] text-llama-fg-5 shrink-0">{t('dashboard.notebookDetail.recently')}</span>
            </button>
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
    </div>
  )
}
