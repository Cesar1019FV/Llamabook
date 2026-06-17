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
    <div className="c-block">
      <div className="c-head">
        <span>{lang}</span>
        <button className="c-copy" onClick={handleCopy}>
          {copied ? t('dashboard.codeBlock.copied') : t('dashboard.codeBlock.copy')}
        </button>
      </div>
      <div className="c-body">{body}</div>
    </div>
  )
}
