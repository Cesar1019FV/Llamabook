import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { Greeting } from './Greeting'
import { QuickActions } from './QuickActions'
import { PinnedSection } from './PinnedSection'
import { NotebooksSection } from './NotebooksSection'

export function DashboardView() {
  const { currentView } = useLlamabookDashboard()

  return (
    <div
      className={clsx(
        'absolute inset-0 flex-col min-h-0 overflow-hidden',
        currentView === 'dashboard' ? 'flex' : 'hidden'
      )}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[780px] mx-auto px-[18px] py-6 pb-[60px] md:px-7 md:py-9">
          <Greeting />
          <QuickActions />
          <PinnedSection />
          <NotebooksSection />
        </div>
      </div>
    </div>
  )
}
