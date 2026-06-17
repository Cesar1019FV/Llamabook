import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'
import { notebookCards } from '../model/data'

export function NotebooksSection() {
  const { t } = useTranslation()
  const { openChat, collapseNotebook } = useLlamabookDashboard()

  return (
    <section className="dash-section">
      <div className="dash-section-head">
        <span className="dash-section-title">{t('dashboard.dashboardView.sections.notebooks')}</span>
      </div>
      <div className="cards-grid">
        {notebookCards.map((card) => (
          <button
            key={card.id}
            className="card"
            onClick={() => {
              collapseNotebook(card.id)
              openChat(card.id)
            }}
          >
            <div className="card-top">
              <span
                className="card-model"
                style={{ background: card.color, color: card.textColor }}
              >
                {card.emoji} {card.name.slice(0, 4)}
              </span>
              <span className="card-time">{card.chatCount} chats</span>
            </div>
            <div className="card-title">{card.name}</div>
            <div className="card-preview">{card.preview}</div>
          </button>
        ))}
      </div>
    </section>
  )
}
