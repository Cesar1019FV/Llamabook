import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconSend, IconWorkspace } from '@/shared/ui/icons'

export function AgentView() {
  const { t } = useTranslation()
  const { agents, currentAgentId, showDashboard, startAgentChat } = useLlamabookDashboard()
  const [activeTab, setActiveTab] = useState<'chat' | 'context'>('chat')

  const agent = agents.find((a) => a.id === currentAgentId)

  if (!agent) {
    return (
      <div className="max-w-[780px] mx-auto px-[18px] py-6 md:px-7 md:py-9">
        <p className="text-llama-fg-4">{t('dashboard.agentDetail.notFound')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-[780px] mx-auto px-[18px] py-6 pb-[60px] md:px-7 md:py-9">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[16px] font-medium text-white shrink-0"
            style={{ background: agent.color }}
          >
            {agent.avatar}
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-xl font-normal text-llama-fg truncate">{agent.name}</h1>
            <p className="text-[12px] text-llama-fg-4">{agent.description}</p>
          </div>
        </div>

        <button
          className="px-3 py-1.5 rounded-lg border border-llama-border text-[12.5px] text-llama-fg-2 transition-colors duration-150 hover:bg-llama-surface"
          onClick={showDashboard}
        >
          {t('dashboard.agentDetail.back')}
        </button>
      </div>

      <div className="flex items-center gap-1 mb-3">
        <button
          className={clsx(
            'px-3 py-1.5 rounded-md text-[12.5px] font-medium',
            activeTab === 'chat'
              ? 'bg-llama-surface text-llama-fg'
              : 'text-llama-fg-4 hover:text-llama-fg-2'
          )}
          onClick={() => setActiveTab('chat')}
        >
          {t('dashboard.agentDetail.tabs.chat')}
        </button>
        <button
          className={clsx(
            'px-3 py-1.5 rounded-md text-[12.5px] font-medium',
            activeTab === 'context'
              ? 'bg-llama-surface text-llama-fg'
              : 'text-llama-fg-4 hover:text-llama-fg-2'
          )}
          onClick={() => setActiveTab('context')}
        >
          {t('dashboard.agentDetail.tabs.context')}
        </button>
      </div>

      {activeTab === 'chat' ? (
        <>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 mb-6 rounded-xl bg-llama-surface border border-llama-border text-[14px] text-llama-fg-3 text-left transition-colors duration-150 hover:bg-llama-surface-2 hover:border-llama-border-2"
            onClick={() => startAgentChat(agent.id)}
          >
            <IconWorkspace className="w-4 h-4 stroke-2" />
            {t('dashboard.agentDetail.startChat', { name: agent.name })}
            <IconSend className="w-4 h-4 stroke-2 ml-auto" />
          </button>

          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-llama-border rounded-xl">
            <div className="w-12 h-12 rounded-full bg-llama-surface flex items-center justify-center mb-4">
              <IconWorkspace className="w-6 h-6 text-llama-fg-4" />
            </div>
            <h3 className="text-[15px] font-medium text-llama-fg mb-1">{t('dashboard.agentDetail.empty.title')}</h3>
            <p className="text-[13px] text-llama-fg-4 max-w-[280px]">{t('dashboard.agentDetail.empty.description', { name: agent.name })}</p>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <label className="block text-[13px] text-llama-fg-2">{t('dashboard.agentDetail.context.title')}</label>
          <textarea
            value={agent.context}
            readOnly
            rows={12}
            className="w-full px-3 py-2.5 rounded-xl bg-llama-surface border border-llama-border text-[14px] text-llama-fg-2 outline-none placeholder:text-llama-fg-5 resize-none"
          />
        </div>
      )}
    </div>
  )
}
