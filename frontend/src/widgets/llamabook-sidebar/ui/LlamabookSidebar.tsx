import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'
import { IconPlus } from '@/shared/ui/icons'
import { SidebarHeader } from './SidebarHeader'
import { SidebarSearch } from './SidebarSearch'
import { SidebarSections } from './SidebarSections'
import { SidebarProfile } from './SidebarProfile'
import './LlamabookSidebar.css'

export function LlamabookSidebar() {
  const { t } = useTranslation()
  const { startNewChat } = useLlamabookDashboard()

  return (
    <aside className="llamabook-sidebar">
      <SidebarHeader />
      <button className="sb-new-chat" onClick={startNewChat}>
        <IconPlus />
        {t('dashboard.sidebar.newChat')}
      </button>
      <SidebarSearch />
      <SidebarSections />
      <SidebarProfile />
    </aside>
  )
}
