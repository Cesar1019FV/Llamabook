import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconClose, IconExport } from '@/shared/ui/icons'
import { exportToPDF, exportToDOCX } from '../lib/export'

export function CanvasToolbar({
  title,
  onTitleChange,
  editorRef,
}: {
  title: string
  onTitleChange: (value: string) => void
  editorRef: React.RefObject<HTMLDivElement | null>
}) {
  const { t } = useTranslation()
  const { closeCanvas } = useLlamabookDashboard()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = useCallback(async () => {
    if (!editorRef.current || isExporting) return
    setIsExporting(true)
    try {
      await exportToPDF(title || t('dashboard.canvas.untitled'), editorRef.current)
    } finally {
      setIsExporting(false)
    }
  }, [editorRef, title, t, isExporting])

  const handleExportDOCX = useCallback(async () => {
    if (!editorRef.current || isExporting) return
    setIsExporting(true)
    try {
      await exportToDOCX(title || t('dashboard.canvas.untitled'), editorRef.current.innerHTML)
    } finally {
      setIsExporting(false)
    }
  }, [editorRef, title, t, isExporting])

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-llama-border bg-llama-surface-2 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-md text-llama-fg-3 hover:bg-llama-surface transition-colors duration-100"
          onClick={closeCanvas}
          aria-label={t('dashboard.canvas.close')}
        >
          <IconClose className="w-4 h-4 stroke-2" />
        </button>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={t('dashboard.canvas.untitled')}
          className="bg-transparent border-0 text-[15px] font-serif text-llama-fg outline-none placeholder:text-llama-fg-4 min-w-0"
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-llama-border text-[12.5px] text-llama-fg-2 transition-colors duration-150',
            isExporting ? 'opacity-60 cursor-default' : 'hover:bg-llama-surface'
          )}
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          <IconExport className="w-3.5 h-3.5" />
          {t('dashboard.canvas.exportPDF')}
        </button>
        <button
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-llama-border text-[12.5px] text-llama-fg-2 transition-colors duration-150',
            isExporting ? 'opacity-60 cursor-default' : 'hover:bg-llama-surface'
          )}
          onClick={handleExportDOCX}
          disabled={isExporting}
        >
          <IconExport className="w-3.5 h-3.5" />
          {t('dashboard.canvas.exportDOCX')}
        </button>
      </div>
    </div>
  )
}
