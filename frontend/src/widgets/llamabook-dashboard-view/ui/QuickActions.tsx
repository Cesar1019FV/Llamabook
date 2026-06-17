import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'
import { IconCode, IconChart, IconBook, IconFile } from '@/shared/ui/icons'

const actions = [
  { id: 'code', icon: IconCode, promptKey: 'codePrompt' },
  { id: 'analysis', icon: IconChart, promptKey: 'analysisPrompt' },
  { id: 'learn', icon: IconBook, promptKey: 'learnPrompt' },
  { id: 'review', icon: IconFile, promptKey: 'reviewPrompt' },
]

export function QuickActions() {
  const { t } = useTranslation()
  const { openChat } = useLlamabookDashboard()

  return (
    <div className="quick-actions flex flex-wrap gap-1.5 mb-6">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            className="q-action flex items-center gap-[5px] py-[7px] px-3.5 rounded-2xl border border-llama-border text-llama-fg-3 text-[12.5px] font-normal whitespace-nowrap transition-all duration-150 hover:border-llama-border-2 hover:text-llama-fg-2 hover:bg-white/[0.06]"
            onClick={() => openChat('new')}
          >
            <Icon className="w-[13px] h-[13px] stroke-2" />
            {t(`dashboard.dashboardView.quickActions.${action.id}`)}
          </button>
        )
      })}
    </div>
  )
}
