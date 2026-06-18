import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconFile, IconPen, IconMessage, IconSend, IconChevron, IconDocument } from '@/shared/ui/icons'

export function PDFChatDetailView() {
  const { t } = useTranslation()
  const {
    pdfSources,
    pdfChats,
    generatedDocs,
    currentPDFSourceId,
    showPDFChatList,
    startPDFChat,
    openPDFChat,
    openCanvas,
  } = useLlamabookDashboard()

  const source = pdfSources.find((s) => s.id === currentPDFSourceId)
  const sourceChats = pdfChats.filter((c) => c.sourceId === currentPDFSourceId)
  const sourceDocs = generatedDocs.filter((d) => d.sourceId === currentPDFSourceId)
  const [chatsOpen, setChatsOpen] = useState(true)
  const [docsOpen, setDocsOpen] = useState(true)

  if (!source) {
    return (
      <div className="max-w-[780px] mx-auto px-[18px] py-6 md:px-7 md:py-9">
        <p className="text-llama-fg-4">{t('dashboard.pdfChatDetail.notFound')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-[780px] mx-auto px-[18px] py-6 pb-[60px] md:px-7 md:py-9">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
            style={{ background: source.color }}
          >
            <IconFile className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-xl font-normal text-llama-fg truncate">{source.name}</h1>
            <p className="text-[12px] text-llama-fg-4">{source.size} · {source.pages} {source.pages === 1 ? 'pagina' : 'paginas'}</p>
          </div>
        </div>
        <button
          className="px-3 py-1.5 rounded-lg border border-llama-border text-[12.5px] text-llama-fg-2 transition-colors duration-150 hover:bg-llama-surface"
          onClick={showPDFChatList}
        >
          {t('dashboard.pdfChatDetail.back')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <button
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-llama-surface border border-llama-border text-[14px] text-llama-fg-3 text-left transition-colors duration-150 hover:bg-llama-surface-2 hover:border-llama-border-2"
          onClick={() => startPDFChat(source.id)}
        >
          <IconMessage className="w-4 h-4 stroke-2" />
          {t('dashboard.pdfChatDetail.newChat')}
          <IconSend className="w-4 h-4 stroke-2 ml-auto" />
        </button>
        <button
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-llama-surface border border-llama-border text-[14px] text-llama-fg-3 text-left transition-colors duration-150 hover:bg-llama-surface-2 hover:border-llama-border-2"
          onClick={() => openCanvas()}
        >
          <IconPen className="w-4 h-4 stroke-2" />
          {t('dashboard.pdfChatDetail.draftDoc')}
          <IconSend className="w-4 h-4 stroke-2 ml-auto" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="border border-llama-border rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-llama-surface/50 text-left"
            onClick={() => setChatsOpen((v) => !v)}
          >
            <span className="text-[14px] font-medium text-llama-fg">{t('dashboard.pdfChatDetail.chats')} ({sourceChats.length})</span>
            <IconChevron className={clsx('w-4 h-4 text-llama-fg-4 transition-transform duration-150', chatsOpen && 'rotate-180')} />
          </button>

          {chatsOpen && (
            <div className="px-2 pb-2">
              {sourceChats.length > 0 ? (
                <div className="space-y-1 pt-1">
                  {sourceChats.map((chat) => (
                    <button
                      key={chat.id}
                      className={clsx(
                        'w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-colors duration-100 hover:bg-llama-surface/50 border border-transparent',
                        'hover:border-llama-border'
                      )}
                      onClick={() => openPDFChat(chat.id)}
                    >
                      <div className="min-w-0 flex items-center gap-2">
                        <IconMessage className="w-4 h-4 text-llama-fg-4 shrink-0" />
                        <div className="text-[13.5px] text-llama-fg-2 truncate">{chat.title}</div>
                      </div>
                      <span className="text-[11px] text-llama-fg-5 shrink-0">{new Date(chat.createdAt).toLocaleDateString()}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-[13px] text-llama-fg-4 max-w-[280px]">{t('dashboard.pdfChatDetail.empty.description')}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border border-llama-border rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-llama-surface/50 text-left"
            onClick={() => setDocsOpen((v) => !v)}
          >
            <span className="text-[14px] font-medium text-llama-fg">{t('dashboard.pdfChatDetail.documents')} ({sourceDocs.length})</span>
            <IconChevron className={clsx('w-4 h-4 text-llama-fg-4 transition-transform duration-150', docsOpen && 'rotate-180')} />
          </button>

          {docsOpen && (
            <div className="px-2 pb-2">
              {sourceDocs.length > 0 ? (
                <div className="space-y-1 pt-1">
                  {sourceDocs.map((doc) => (
                    <button
                      key={doc.id}
                      className={clsx(
                        'w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-colors duration-100 hover:bg-llama-surface/50 border border-transparent',
                        'hover:border-llama-border'
                      )}
                      onClick={() => openCanvas(doc.id)}
                    >
                      <div className="min-w-0 flex items-center gap-2">
                        <IconDocument className="w-4 h-4 text-llama-fg-4 shrink-0" />
                        <div className="text-[13.5px] text-llama-fg-2 truncate">{doc.title}</div>
                      </div>
                      <span className="text-[11px] text-llama-fg-5 shrink-0">{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-[13px] text-llama-fg-4 max-w-[280px]">{t('dashboard.pdfChatDetail.emptyDocs')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
