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
    <div className="quick-actions">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            className="q-action"
            onClick={() => openChat('new')}
          >
            <Icon />
            {t(`dashboard.dashboardView.quickActions.${action.id}`)}
          </button>
        )
      })}
    </div>
  )
}
