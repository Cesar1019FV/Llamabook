import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Document, Page, pdfjs } from 'react-pdf'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconClose, IconPDF, IconPen, IconChevron } from '@/shared/ui/icons'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

export function PDFPreviewPanel({ sourceId }: { sourceId: string }) {
  const { t } = useTranslation()
  const { pdfSources, closePDFPreview, togglePDFPreview, openCanvas } = useLlamabookDashboard()
  const source = pdfSources.find((s) => s.id === sourceId)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.1)

  if (!source) {
    return (
      <div className="flex items-center justify-center h-full text-llama-fg-4 text-[13px]">
        PDF no encontrado
      </div>
    )
  }

  const url = source.url

  return (
    <div className="flex flex-col h-full bg-llama-surface">
      <div className="flex items-center justify-between px-3 py-2 border-b border-llama-border bg-llama-surface-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <IconPDF className="w-4 h-4 text-llama-fg-4 shrink-0" />
          <span className="text-[12.5px] text-llama-fg truncate">{source.name}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-llama-fg text-llama-bg text-[12px] font-medium transition-colors duration-150 hover:bg-llama-fg-2"
            onClick={() => openCanvas()}
          >
            <IconPen className="w-3.5 h-3.5" />
            {t('dashboard.pdfChatDetail.startDraft')}
          </button>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-md text-llama-fg-3 hover:bg-llama-surface transition-colors duration-100"
            onClick={closePDFPreview}
            aria-label={t('dashboard.pdfChatDetail.collapsePreview')}
          >
            <IconClose className="w-3.5 h-3.5 stroke-2" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-2 border-b border-llama-border bg-llama-surface shrink-0">
        <div className="flex items-center gap-1">
          <button
            className="w-7 h-7 flex items-center justify-center rounded-md text-llama-fg-3 hover:bg-llama-surface-2 disabled:opacity-40"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            aria-label={t('dashboard.pdfChatDetail.prevPage')}
          >
            <IconChevron className="w-4 h-4 rotate-90" />
          </button>
          <span className="text-[12px] text-llama-fg-3 w-[70px] text-center">
            {numPages > 0 ? `${pageNumber} / ${numPages}` : '—'}
          </span>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-md text-llama-fg-3 hover:bg-llama-surface-2 disabled:opacity-40"
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            aria-label={t('dashboard.pdfChatDetail.nextPage')}
          >
            <IconChevron className="w-4 h-4 -rotate-90" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          {[0.8, 1.1, 1.5].map((s) => (
            <button
              key={s}
              className={clsx(
                'px-2 py-1 rounded-md text-[11px] transition-colors duration-150',
                scale === s
                  ? 'bg-llama-fg text-llama-bg'
                  : 'text-llama-fg-3 hover:bg-llama-surface-2'
              )}
              onClick={() => setScale(s)}
            >
              {Math.round(s * 100)}%
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-4">
        {url ? (
          <Document
            file={url}
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n)
              setPageNumber((p) => Math.min(p, n))
            }}
            loading={
              <div className="flex items-center justify-center h-full text-[13px] text-llama-fg-4">
                {t('dashboard.pdfChatDetail.loadingPreview')}
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-xl bg-[#FAF9F7]/10 flex items-center justify-center mb-3">
                  <IconPDF className="w-8 h-8 text-llama-fg-3" />
                </div>
                <p className="text-[13px] text-llama-fg-3 mb-1">{t('dashboard.pdfChatDetail.previewError')}</p>
              </div>
            }
          >
            <div className="flex flex-col items-center gap-4">
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-[0_2px_12px_rgba(0,0,0,0.18)]"
              />
            </div>
          </Document>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-xl bg-[#FAF9F7]/10 flex items-center justify-center mb-4">
              <IconPDF className="w-10 h-10 text-llama-fg-3" />
            </div>
            <p className="text-[13px] text-llama-fg-3 mb-1">{t('dashboard.pdfChatDetail.placeholderPreview')}</p>
            <p className="text-[12px] text-llama-fg-4">{source.size} · {source.pages} {source.pages === 1 ? 'pagina' : 'paginas'}</p>
            <button
              className="mt-4 px-3 py-1.5 rounded-lg border border-llama-border text-[12px] text-llama-fg-2 hover:bg-llama-surface transition-colors duration-150"
              onClick={togglePDFPreview}
            >
              {t('dashboard.pdfChatDetail.collapsePreview')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
