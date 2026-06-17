import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'
import { pinnedItems } from '../model/data'

export function PinnedSection() {
  const { t } = useTranslation()
  const { openChat } = useLlamabookDashboard()

  return (
    <section className="dash-section">
      <div className="dash-section-head">
        <span className="dash-section-title">{t('dashboard.dashboardView.sections.pinned')}</span>
      </div>
      <div className="cards-grid">
        {pinnedItems.map((item) => (
          <button
            key={item.id}
            className="card pinned"
            onClick={() => openChat(item.id)}
          >
            <div className="card-top">
              <span className="card-model">Pro</span>
              <span className="card-time">{item.time}</span>
            </div>
            <div className="card-title">{item.title}</div>
            <div className="card-preview">{item.preview}</div>
          </button>
        ))}
      </div>
    </section>
  )
}
