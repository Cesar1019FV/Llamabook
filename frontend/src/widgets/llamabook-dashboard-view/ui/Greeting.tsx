import { useTranslation } from 'react-i18next'

export function Greeting() {
  const { t } = useTranslation()
  const hour = new Date().getHours()
  const greetingKey =
    hour >= 19 ? 'evening' : hour >= 12 ? 'afternoon' : 'morning'

  return (
    <div className="greeting">
      <h1>
        {t(`dashboard.dashboardView.greeting.${greetingKey}`)}, {t('dashboard.sidebar.profile.name')}
      </h1>
      <p>{t('dashboard.dashboardView.greeting.subtitle')}</p>
    </div>
  )
}
