import { useTranslation } from 'react-i18next'
import { IconMore } from '@/shared/ui/icons'

export function SidebarProfile() {
  const { t } = useTranslation()

  return (
    <div className="sb-foot">
      <div className="sb-profile">
        <div className="sb-av">{t('dashboard.sidebar.profile.name')[0]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sb-pname">{t('dashboard.sidebar.profile.name')}</div>
          <div className="sb-ppro">{t('dashboard.sidebar.profile.plan')}</div>
        </div>
        <div className="sb-pmore">
          <IconMore />
        </div>
      </div>
    </div>
  )
}
