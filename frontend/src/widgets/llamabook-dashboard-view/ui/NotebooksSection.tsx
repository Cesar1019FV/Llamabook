import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'
import { notebookCards } from '../model/data'

export function NotebooksSection() {
  const { t } = useTranslation()
  const { openChat, collapseNotebook } = useLlamabookDashboard()

  return (
    <section className="dash-section mb-5">
      <div className="dash-section-head flex items-center justify-between mb-2">
        <span className="dash-section-title text-[13px] font-medium text-llama-fg-3">{t('dashboard.dashboardView.sections.notebooks')}</span>
      </div>

      <div className="cards-grid grid grid-cols-1 sm:grid-cols-2 lg:[grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-1.5">
        {notebookCards.map((card) => (
          <button
            key={card.id}
            className="card text-left p-[11px] pb-3 rounded-lg border border-llama-border bg-transparent cursor-pointer transition-all duration-150 hover:border-llama-border-2 hover:bg-white/[0.015]"
            onClick={() => {
              collapseNotebook(card.id)
              openChat(card.id)
            }}
          >
            <div className="card-top flex items-center justify-between mb-[5px]">
              <span
                className="card-model text-[10px] font-normal px-1 py-px rounded"
                style={{ background: card.color, color: card.textColor }}
              >
                {card.emoji} {card.name.slice(0, 4)}
              </span>
              <span className="card-time text-[10px] text-llama-fg-5 font-normal">{card.chatCount} chats</span>
            </div>
            <div className="card-title text-[13px] font-medium text-llama-fg-2 leading-tight mb-[3px] overflow-hidden text-ellipsis whitespace-nowrap">
              {card.name}
            </div>
            <div className="card-preview text-[11.5px] text-llama-fg-4 font-normal leading-snug line-clamp-2">
              {card.preview}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
