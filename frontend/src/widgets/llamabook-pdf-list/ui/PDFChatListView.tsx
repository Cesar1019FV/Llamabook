import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconPDF, IconSearch, IconPlus } from '@/shared/ui/icons'

export function PDFChatListView() {
  const { t } = useTranslation()
  const { pdfSources, showPDFChatDetail, openUploadPDFModal } = useLlamabookDashboard()
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? pdfSources.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    : pdfSources
  const hasSources = filtered.length > 0

  return (
    <div className="max-w-[900px] mx-auto px-[18px] py-6 pb-[60px] md:px-7 md:py-9">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-normal text-llama-fg">{t('dashboard.pdfChatList.title')}</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-llama-surface border border-llama-border">
            <IconSearch className="w-4 h-4 text-llama-fg-5 stroke-[1.8]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('dashboard.pdfChatList.searchPlaceholder')}
              className="bg-transparent border-0 text-[13px] text-llama-fg-2 placeholder:text-llama-fg-5 outline-none w-[140px] md:w-[200px]"
            />
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-llama-fg text-llama-bg text-[13px] font-medium transition-colors duration-150 hover:bg-llama-fg-2"
            onClick={openUploadPDFModal}
          >
            <IconPlus className="w-4 h-4 stroke-2" />
            {t('dashboard.pdfChatList.upload')}
          </button>
        </div>
      </div>

      {hasSources ? (
        <div className="border border-llama-border rounded-xl overflow-hidden">
          {filtered.map((source) => (
            <button
              key={source.id}
              className={clsx(
                'w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-100 hover:bg-llama-surface/50',
                'border-b border-llama-border last:border-b-0'
              )}
              onClick={() => showPDFChatDetail(source.id)}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-white shrink-0"
                  style={{ background: source.color }}
                >
                  <IconPDF className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13.5px] text-llama-fg truncate text-left">{source.name}</div>
                  <div className="text-[12px] text-llama-fg-4 truncate text-left">{source.size} · {source.pages} {source.pages === 1 ? 'página' : 'páginas'}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-llama-border rounded-xl cursor-pointer transition-colors duration-150 hover:bg-llama-surface/30"
          onClick={openUploadPDFModal}
        >
          <div className="w-12 h-12 rounded-full bg-llama-surface flex items-center justify-center mb-4">
            <IconPDF className="w-6 h-6 text-llama-fg-4" />
          </div>
          <h3 className="text-[15px] font-medium text-llama-fg mb-1">{t('dashboard.pdfChatList.empty.title')}</h3>
          <p className="text-[13px] text-llama-fg-4 max-w-[280px] mb-4">{t('dashboard.pdfChatList.empty.description')}</p>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-llama-fg text-llama-bg text-[13px] font-medium transition-colors duration-150 hover:bg-llama-fg-2"
            onClick={openUploadPDFModal}
          >
            <IconPlus className="w-4 h-4 stroke-2" />
            {t('dashboard.pdfChatList.upload')}
          </button>
        </div>
      )}
    </div>
  )
}
