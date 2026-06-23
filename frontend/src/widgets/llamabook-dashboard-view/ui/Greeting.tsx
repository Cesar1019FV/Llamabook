import { useTranslation } from 'react-i18next'
import { useAuth } from '@/features/auth'

export function Greeting() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greetingKey =
    hour >= 19 ? 'evening' : hour >= 12 ? 'afternoon' : 'morning'

  const displayName = user?.name ?? user?.email ?? t('dashboard.sidebar.profile.name')

  return (
    <div className="greeting mb-5">
      <h1 className="font-serif text-2xl font-normal text-llama-fg leading-tight mb-1">
        {t(`dashboard.dashboardView.greeting.${greetingKey}`)}, {displayName}
      </h1>
      <p className="text-[13.5px] text-llama-fg-4 font-normal leading-relaxed">
        {t('dashboard.dashboardView.greeting.subtitle')}
      </p>
    </div>
  )
}
