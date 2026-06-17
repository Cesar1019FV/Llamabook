import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface CodeBlockProps {
  lang: string
  body: string
}

export function CodeBlock({ lang, body }: CodeBlockProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(body).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }

  return (
    <div className="c-block my-3 ml-10 rounded-lg overflow-hidden border border-llama-border bg-black/30">
      <div className="c-head flex items-center justify-between px-3 py-[7px] border-b border-llama-border text-[11.5px] text-llama-fg-4 font-mono">
        <span>{lang}</span>
        <button
          className="c-copy py-0.5 px-2 rounded border border-llama-border bg-transparent text-llama-fg-4 text-[11px] font-mono cursor-pointer transition-all duration-150 hover:bg-white/[0.10] hover:text-llama-fg-2 hover:border-llama-border-2"
          onClick={handleCopy}
        >
          {copied ? t('dashboard.codeBlock.copied') : t('dashboard.codeBlock.copy')}
        </button>
      </div>
      <div className="c-body px-3.5 py-3 font-mono text-[12.5px] leading-relaxed text-llama-fg-2 overflow-x-auto whitespace-pre min-w-0">
        {body}
      </div>
    </div>
  )
}
