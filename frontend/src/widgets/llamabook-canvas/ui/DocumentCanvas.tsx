import { useEffect, useRef, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'
import { CanvasToolbar } from './CanvasToolbar'

export function DocumentCanvas() {
  const { t } = useTranslation()
  const {
    generatedDocs,
    currentGeneratedDocId,
    updateGeneratedDoc,
    isGenerating,
    currentPDFSourceId,
  } = useLlamabookDashboard()
  const editorRef = useRef<HTMLDivElement>(null)

  const doc = generatedDocs.find((d) => d.id === currentGeneratedDocId)

  const [title, setTitle] = useState(doc?.title ?? '')

  useEffect(() => {
    if (doc) {
      setTitle(doc.title)
      if (editorRef.current && editorRef.current.innerHTML !== doc.content) {
        editorRef.current.innerHTML = doc.content
      }
    }
  }, [doc?.id])

  const handleInput = useCallback(() => {
    if (!currentGeneratedDocId || !editorRef.current) return
    updateGeneratedDoc(currentGeneratedDocId, editorRef.current.innerHTML)
  }, [currentGeneratedDocId, updateGeneratedDoc])

  useEffect(() => {
    if (!isGenerating || !editorRef.current || !currentPDFSourceId) return
    const placeholder = t('dashboard.canvas.aiWriting')
    if (editorRef.current.innerHTML === '') {
      editorRef.current.innerHTML = `<p class="text-llama-fg-3 italic">${placeholder}</p>`
    }
  }, [isGenerating, currentPDFSourceId, t])

  if (!doc) {
    return (
      <div className="flex items-center justify-center h-full text-llama-fg-4">
        {t('dashboard.canvas.untitled')}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-llama-bg">
      <CanvasToolbar
        title={title}
        onTitleChange={(value) => {
          setTitle(value)
          updateGeneratedDoc(doc.id, { ...doc, title: value } as never)
        }}
        editorRef={editorRef}
      />

      <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[816px] mx-auto">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            className="min-h-[1100px] px-12 py-14 bg-[#FAF9F7] text-[#1A1A18] rounded-sm shadow-[0_2px_12px_rgba(0,0,0,0.12)] outline-none"
            style={{
              fontFamily: '"Styrene A", -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '17px',
              lineHeight: '1.65',
              letterSpacing: '-0.01em',
            }}
            data-placeholder={t('dashboard.canvas.placeholder')}
          />
        </div>
      </div>
    </div>
  )
}
