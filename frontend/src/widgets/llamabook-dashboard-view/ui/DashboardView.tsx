import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { Greeting } from './Greeting'
import { QuickActions } from './QuickActions'
import { PinnedSection } from './PinnedSection'
import { NotebooksSection } from './NotebooksSection'
import './DashboardView.css'

export function DashboardView() {
  const { currentView } = useLlamabookDashboard()

  return (
    <div className={clsx('dashboard-view view', currentView === 'dashboard' && 'active')}>
      <div className="dash-inner">
        <Greeting />
        <QuickActions />
        <PinnedSection />
        <NotebooksSection />
      </div>
    </div>
  )
}
