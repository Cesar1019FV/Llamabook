import { SidebarHeader } from './SidebarHeader'
import { SidebarNav } from './SidebarNav'
import { SidebarSections } from './SidebarSections'
import { SidebarProfile } from './SidebarProfile'
import { SettingsModal } from './SettingsModal'
import { CreateNotebookModal } from './CreateNotebookModal'
import { CreateAgentModal } from './CreateAgentModal'

export function LlamabookSidebar() {
  return (
    <div className="flex flex-col h-full min-w-[var(--sidebar-w)]">
      <SidebarHeader />
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2">
        <div className="py-1">
          <SidebarNav />
        </div>
        <SidebarSections />
      </div>
      <SidebarProfile />
      <SettingsModal />
      <CreateNotebookModal />
      <CreateAgentModal />
    </div>
  )
}
