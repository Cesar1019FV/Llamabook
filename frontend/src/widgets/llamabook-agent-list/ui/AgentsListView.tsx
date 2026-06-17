import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconSearch, IconPlus, IconWorkspace } from '@/shared/ui/icons'

export function AgentsListView() {
  const { t } = useTranslation()
  const { agents, showAgentDetail, openCreateAgentModal } = useLlamabookDashboard()
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? agents.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.description.toLowerCase().includes(query.toLowerCase()))
    : agents
  const hasAgents = filtered.length > 0

  return (
    <div className="max-w-[900px] mx-auto px-[18px] py-6 pb-[60px] md:px-7 md:py-9">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-normal text-llama-fg">{t('dashboard.agentsList.title')}</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-llama-surface border border-llama-border">
            <IconSearch className="w-4 h-4 text-llama-fg-5 stroke-[1.8]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('dashboard.agentsList.searchPlaceholder')}
              className="bg-transparent border-0 text-[13px] text-llama-fg-2 placeholder:text-llama-fg-5 outline-none w-[140px] md:w-[200px]"
            />
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-llama-fg text-llama-bg text-[13px] font-medium transition-colors duration-150 hover:bg-llama-fg-2"
            onClick={openCreateAgentModal}
          >
            <IconPlus className="w-4 h-4 stroke-2" />
            {t('dashboard.agentsList.create')}
          </button>
        </div>
      </div>

      {hasAgents ? (
        <div className="border border-llama-border rounded-xl overflow-hidden">
          {filtered.map((agent) => (
            <button
              key={agent.id}
              className={clsx(
                'w-full flex items-center px-4 py-3 text-left transition-colors duration-100 hover:bg-llama-surface/50',
                'border-b border-llama-border last:border-b-0'
              )}
              onClick={() => showAgentDetail(agent.id)}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[12px] font-medium text-white shrink-0"
                  style={{ background: agent.color }}
                >
                  {agent.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-[13.5px] text-llama-fg truncate text-left">{agent.name}</div>
                  <div className="text-[12px] text-llama-fg-4 truncate text-left">{agent.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-llama-surface flex items-center justify-center mb-4">
            <IconWorkspace className="w-6 h-6 text-llama-fg-4" />
          </div>
          <h3 className="text-[15px] font-medium text-llama-fg mb-1">{t('dashboard.agentsList.empty.title')}</h3>
          <p className="text-[13px] text-llama-fg-4 max-w-[280px] mb-4">{t('dashboard.agentsList.empty.description')}</p>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-llama-fg text-llama-bg text-[13px] font-medium transition-colors duration-150 hover:bg-llama-fg-2"
            onClick={openCreateAgentModal}
          >
            <IconPlus className="w-4 h-4 stroke-2" />
            {t('dashboard.agentsList.create')}
          </button>
        </div>
      )}
    </div>
  )
}
