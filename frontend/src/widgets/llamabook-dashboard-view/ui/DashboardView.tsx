import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { Greeting } from './Greeting'
import { QuickActions } from './QuickActions'
import { PinnedSection } from './PinnedSection'
import { NotebooksSection } from './NotebooksSection'
import { NotebooksListView } from '@/widgets/llamabook-notebooks-list/ui/NotebooksListView'
import { NotebookView } from '@/widgets/llamabook-notebook-view/ui/NotebookView'
import { AgentsListView } from '@/widgets/llamabook-agent-list/ui/AgentsListView'
import { AgentView } from '@/widgets/llamabook-agent-view/ui/AgentView'
import { PDFChatListView } from '@/widgets/llamabook-pdf-list/ui/PDFChatListView'
import { PDFChatDetailView } from '@/widgets/llamabook-pdf-view/ui/PDFChatDetailView'
import { LibraryView } from '@/widgets/llamabook-library/ui/LibraryView'

export function DashboardView() {
  const { currentView } = useLlamabookDashboard()

  return (
    <div
      className={clsx(
        'flex flex-col min-h-0 overflow-hidden',
        currentView !== 'chat' ? 'flex' : 'hidden'
      )}
    >
      <div className="flex-1 overflow-y-auto">
        {currentView === 'dashboard' && (
          <div className="max-w-[780px] mx-auto px-[18px] py-6 pb-[60px] md:px-7 md:py-9">
            <Greeting />
            <QuickActions />
            <PinnedSection />
            <NotebooksSection />
          </div>
        )}

        {currentView === 'notebooks-list' && <NotebooksListView />}

        {currentView === 'notebook-detail' && <NotebookView />}

        {currentView === 'agents-list' && <AgentsListView />}

        {currentView === 'agent-detail' && <AgentView />}

        {currentView === 'pdf-chat-list' && <PDFChatListView />}

        {currentView === 'pdf-chat-detail' && <PDFChatDetailView />}

        {currentView === 'library' && <LibraryView />}
      </div>
    </div>
  )
}
