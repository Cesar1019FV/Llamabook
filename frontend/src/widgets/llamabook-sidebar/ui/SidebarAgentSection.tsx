import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'
import { IconPlus } from '@/shared/ui/icons'

export function SidebarAgentSection() {
  const { t } = useTranslation()
  const { agents, showAgentDetail, openCreateAgentModal } = useLlamabookDashboard()

  const hasAgents = agents.length > 0

  return (
    <div className="mb-0.5">
      <div className="flex items-center justify-between py-2.5 pb-1.5 px-2 select-none">
        <span className="text-[11.5px] font-medium text-llama-fg-3 tracking-wide">{t('dashboard.sidebar.agents')}</span>
        <div className="relative group/tooltip">
          <button
            className="sb-section-add w-[18px] h-[18px] flex items-center justify-center rounded text-llama-fg-3 transition-all duration-100 hover:text-llama-fg hover:bg-white/[0.12] shrink-0"
            onClick={() => {
              openCreateAgentModal()
            }}
            aria-label={t('dashboard.sidebar.newAgent')}
            type="button"
          >
            <IconPlus className="w-3 h-3 stroke-[2.5]" />
          </button>
          <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded-md bg-llama-surface-2 border border-llama-border text-[11px] text-llama-fg-2 whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-100 group-hover/tooltip:opacity-100 z-[70]">
            {t('dashboard.sidebar.newAgent')}
          </span>
        </div>
      </div>

      <div>
        {hasAgents ? (
          agents.map((agent) => (
            <button
              key={agent.id}
              className="sb-agent sb-chat block w-full min-w-0 py-[7px] px-2.5 rounded-lg text-llama-fg text-[13.5px] font-normal text-left transition-colors duration-100 whitespace-nowrap overflow-hidden text-ellipsis leading-[1.4] hover:bg-llama-sidebar-hover hover:text-llama-fg"
              onClick={() => showAgentDetail(agent.id)}
            >
              <span className="mr-1.5 inline-flex items-center justify-center w-[18px] h-[18px] rounded text-[11px] shrink-0" style={{ background: agent.color }}>
                {agent.avatar}
              </span>
              {agent.name}
            </button>
          ))
        ) : (
          <div className="px-2.5 py-2 text-[12.5px] text-llama-fg-3 italic">
            {t('dashboard.sidebar.noAgents')}
          </div>
        )}
      </div>
    </div>
  )
}
