import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'
import { IconPlus } from '@/shared/ui/icons'
import { SidebarHeader } from './SidebarHeader'
import { SidebarSearch } from './SidebarSearch'
import { SidebarSections } from './SidebarSections'
import { SidebarProfile } from './SidebarProfile'

export function LlamabookSidebar() {
  const { t } = useTranslation()
  const { startNewChat } = useLlamabookDashboard()

  return (
    <>
      <SidebarHeader />
      <button
        className="sb-new-chat flex items-center gap-[7px] mx-3 mb-2 px-3 py-2 rounded-lg text-llama-fg-2 text-[13.5px] font-normal transition-colors duration-150 shrink-0 w-[calc(100%-24px)] hover:bg-llama-sidebar-hover"
        onClick={startNewChat}
      >
        <IconPlus className="w-[15px] h-[15px] stroke-current fill-none stroke-2 shrink-0" />
        {t('dashboard.sidebar.newChat')}
      </button>
      <SidebarSearch />
      <SidebarSections />
      <SidebarProfile />
    </>
  )
}
