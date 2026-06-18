import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconClose, IconPDF, IconUpload, IconInfo } from '@/shared/ui/icons'

export function UploadPDFModal() {
  const { t } = useTranslation()
  const { uploadPDFModalOpen, closeUploadPDFModal, uploadPDF } = useLlamabookDashboard()
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  if (!uploadPDFModalOpen) return null

  const handleFiles = (list: FileList | null) => {
    if (!list) return
    const valid = Array.from(list).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    )
    if (valid.length > 0) {
      setFiles((prev) => [...prev, ...valid])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name))
  }

  const handleUpload = () => {
    if (files.length === 0) return
    uploadPDF(files)
    setFiles([])
  }

  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  const sizeText =
    totalSize > 1024 * 1024
      ? `${(totalSize / (1024 * 1024)).toFixed(1)} MB`
      : `${(totalSize / 1024).toFixed(0)} KB`

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeUploadPDFModal()
      }}
    >
      <div className="w-full max-w-[460px] bg-llama-surface-2 border border-llama-border-2 rounded-2xl shadow-[0_16px_60px_rgba(0,0,0,0.5)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-medium text-llama-fg">{t('dashboard.uploadPDF.title')}</h2>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md text-llama-fg-3 hover:bg-llama-surface"
            onClick={closeUploadPDFModal}
            aria-label={t('dashboard.uploadPDF.close')}
          >
            <IconClose className="w-4 h-4 stroke-2" />
          </button>
        </div>

        <div
          className={clsx(
            'flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed transition-colors duration-150',
            dragOver ? 'border-llama-fg-3 bg-llama-surface' : 'border-llama-border bg-llama-surface/50'
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="w-12 h-12 rounded-full bg-llama-surface flex items-center justify-center">
            <IconPDF className="w-6 h-6 text-llama-fg-3" />
          </div>
          <p className="text-[14px] text-llama-fg-2 text-center">{t('dashboard.uploadPDF.drop')}</p>
          <p className="text-[12px] text-llama-fg-4">{t('dashboard.uploadPDF.or')}</p>
          <button
            className="px-4 py-2 rounded-lg bg-llama-fg text-llama-bg text-[13px] font-medium transition-colors duration-150 hover:bg-llama-fg-2"
            onClick={() => fileRef.current?.click()}
          >
            {t('dashboard.uploadPDF.browse')}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleChange}
            className="hidden"
          />
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-llama-surface border border-llama-border">
              <IconInfo className="w-4 h-4 text-llama-fg-4 shrink-0 mt-0.5" />
              <p className="text-[12px] text-llama-fg-4 leading-relaxed">{t('dashboard.uploadPDF.mergeWarning')}</p>
            </div>
            <div className="space-y-1">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-llama-surface border border-llama-border"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <IconPDF className="w-4 h-4 text-llama-fg-4 shrink-0" />
                    <span className="text-[13px] text-llama-fg-2 truncate">{file.name}</span>
                  </div>
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-md text-llama-fg-4 hover:bg-llama-surface-2 shrink-0"
                    onClick={() => removeFile(file.name)}
                    aria-label={t('dashboard.uploadPDF.removeFile')}
                  >
                    <IconClose className="w-3 h-3 stroke-2" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-[12px] text-llama-fg-4 px-1">
              <span>{files.length} {files.length === 1 ? 'PDF' : 'PDFs'}</span>
              <span>{sizeText}</span>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg border border-llama-border text-[13px] text-llama-fg-2 transition-colors duration-150 hover:bg-llama-surface"
            onClick={closeUploadPDFModal}
          >
            {t('dashboard.uploadPDF.cancel')}
          </button>
          <button
            className={clsx(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg bg-llama-fg text-llama-bg text-[13px] font-medium transition-colors duration-150',
              files.length === 0 ? 'opacity-50 cursor-default' : 'hover:bg-llama-fg-2'
            )}
            onClick={handleUpload}
            disabled={files.length === 0}
          >
            <IconUpload className="w-4 h-4" />
            {files.length <= 1 ? t('dashboard.uploadPDF.upload') : t('dashboard.uploadPDF.mergeUpload')}
          </button>
        </div>
      </div>
    </div>
  )
}
