import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'
import { pinnedItems } from '../model/data'

export function PinnedSection() {
  const { t } = useTranslation()
  const { openChat } = useLlamabookDashboard()

  return (
    <section className="dash-section mb-5">
      <div className="dash-section-head flex items-center justify-between mb-2">
        <span className="dash-section-title text-[13px] font-medium text-llama-fg-3">{t('dashboard.dashboardView.sections.pinned')}</span>
      </div>

      <div className="cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-1.5">
        {pinnedItems.map((item) => (
          <button
            key={item.id}
            className="card pinned relative text-left p-[11px] pb-3 rounded-lg border border-llama-border bg-transparent cursor-pointer transition-all duration-150 hover:border-llama-border-2 hover:bg-white/[0.015]"
            onClick={() => openChat(item.id)}
          >
            <div className="card-top flex items-center justify-between mb-[5px]">
              <span className="card-model text-[10px] text-llama-fg-5 font-normal px-1 py-px rounded bg-white/[0.08]">Pro</span>
              <span className="card-time text-[10px] text-llama-fg-5 font-normal">{item.time}</span>
            </div>
            <div className="card-title text-[13px] font-medium text-llama-fg-2 leading-tight mb-[3px] overflow-hidden text-ellipsis whitespace-nowrap">
              {item.title}
            </div>
            <div className="card-preview text-[11.5px] text-llama-fg-4 font-normal leading-snug line-clamp-2">
              {item.preview}
            </div>

            <span className="absolute top-2 right-2 w-1 h-1 rounded-full bg-llama-accent" />
          </button>
        ))}
      </div>
    </section>
  )
}
