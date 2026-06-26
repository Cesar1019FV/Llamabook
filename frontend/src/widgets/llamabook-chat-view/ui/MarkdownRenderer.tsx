import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { IconCheck, IconCopy } from '@/shared/ui/icons'

interface MarkdownRendererProps {
  children: string
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }

  return (
    <div className="md-code-block my-3 rounded-lg overflow-hidden border border-llama-border bg-[#1e1e1e]">
      <div className="md-code-head flex items-center justify-between px-3 py-1.5 border-b border-llama-border bg-white/[0.02]">
        <span className="text-[11px] font-mono text-llama-fg-4">{language || 'text'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono text-llama-fg-4 transition-all duration-150 hover:text-llama-fg-2 hover:bg-white/[0.06]"
        >
          {copied ? (
            <IconCheck className="w-3 h-3 stroke-[2] text-llama-online" />
          ) : (
            <IconCopy className="w-3 h-3 stroke-[2]" />
          )}
          <span>{copied ? t('dashboard.codeBlock.copied') : t('dashboard.codeBlock.copy')}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        PreTag="div"
        customStyle={{
          margin: 0,
          background: 'transparent',
          padding: '12px 14px',
          fontSize: '12.5px',
          fontFamily: 'var(--font-mono)',
        }}
        codeTagProps={{
          style: { fontFamily: 'var(--font-mono)', fontSize: '12.5px' },
        }}
      >
        {code.replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  )
}

export function MarkdownRenderer({ children }: MarkdownRendererProps) {
  const components = {
    p: ({ children: c }: { children?: ReactNode }) => (
      <p className="md-p mb-3 leading-[1.7]">{c}</p>
    ),
    h1: ({ children: c }: { children?: ReactNode }) => (
      <h1 className="md-h text-[20px] font-semibold mt-4 mb-2 text-llama-fg">{c}</h1>
    ),
    h2: ({ children: c }: { children?: ReactNode }) => (
      <h2 className="md-h text-[18px] font-semibold mt-4 mb-2 text-llama-fg">{c}</h2>
    ),
    h3: ({ children: c }: { children?: ReactNode }) => (
      <h3 className="md-h text-[16px] font-semibold mt-3 mb-1.5 text-llama-fg">{c}</h3>
    ),
    h4: ({ children: c }: { children?: ReactNode }) => (
      <h4 className="md-h text-[15px] font-semibold mt-3 mb-1.5 text-llama-fg">{c}</h4>
    ),
    h5: ({ children: c }: { children?: ReactNode }) => (
      <h5 className="md-h text-[14px] font-semibold mt-2 mb-1 text-llama-fg-2">{c}</h5>
    ),
    h6: ({ children: c }: { children?: ReactNode }) => (
      <h6 className="md-h text-[13px] font-semibold mt-2 mb-1 text-llama-fg-3">{c}</h6>
    ),
    ul: ({ children: c }: { children?: ReactNode }) => (
      <ul className="md-ul list-disc pl-5 mb-3 space-y-1">{c}</ul>
    ),
    ol: ({ children: c }: { children?: ReactNode }) => (
      <ol className="md-ol list-decimal pl-5 mb-3 space-y-1">{c}</ol>
    ),
    li: ({ children: c }: { children?: ReactNode }) => (
      <li className="md-li leading-[1.65]">{c}</li>
    ),
    a: ({ href, children: c }: { href?: string; children?: ReactNode }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="md-a text-llama-accent-light underline decoration-llama-accent/40 underline-offset-2 hover:decoration-llama-accent transition-colors duration-100"
      >
        {c}
      </a>
    ),
    blockquote: ({ children: c }: { children?: ReactNode }) => (
      <blockquote className="md-bq my-3 pl-3 border-l-2 border-llama-border-2 text-llama-fg-3 italic">
        {c}
      </blockquote>
    ),
    hr: () => <hr className="md-hr my-4 border-0 border-t border-llama-border" />,
    strong: ({ children: c }: { children?: ReactNode }) => (
      <strong className="md-strong font-semibold text-llama-fg">{c}</strong>
    ),
    em: ({ children: c }: { children?: ReactNode }) => <em className="md-em">{c}</em>,
    del: ({ children: c }: { children?: ReactNode }) => (
      <del className="md-del text-llama-fg-4 line-through">{c}</del>
    ),
    table: ({ children: c }: { children?: ReactNode }) => (
      <div className="md-table-wrap my-3 overflow-x-auto">
        <table className="md-table w-full border-collapse text-[13px]">{c}</table>
      </div>
    ),
    thead: ({ children: c }: { children?: ReactNode }) => (
      <thead className="md-thead bg-white/[0.03]">{c}</thead>
    ),
    th: ({ children: c }: { children?: ReactNode }) => (
      <th className="md-th px-3 py-1.5 text-left font-semibold text-llama-fg-2 border border-llama-border">
        {c}
      </th>
    ),
    td: ({ children: c }: { children?: ReactNode }) => (
      <td className="md-td px-3 py-1.5 text-llama-fg-3 border border-llama-border even:bg-white/[0.015]">
        {c}
      </td>
    ),
    code: ({ className, children: c }: { className?: string; children?: ReactNode }) => {
      const match = /language-(\w+)/.exec(className || '')
      const codeStr = String(c ?? '').replace(/\n$/, '')
      if (match) {
        return <CodeBlock language={match[1]} code={codeStr} />
      }
      return (
        <code className="md-code-inline px-1 py-0.5 rounded bg-white/[0.07] font-mono text-[13px] text-llama-fg-2">
          {c}
        </code>
      )
    },
    pre: ({ children: c }: { children?: ReactNode }) => <>{c}</>,
  }

  return (
    <div className="md-body font-serif text-[15px] font-normal leading-[1.7] text-llama-fg max-w-full break-words">
      <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={components}>
        {children}
      </Markdown>
    </div>
  )
}