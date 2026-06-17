import { useEffect } from 'react'
import clsx from 'clsx'
import { LlamabookDashboardProvider, useLlamabookDashboard } from '@/app/providers'
import { LlamabookSidebar } from '@/widgets/llamabook-sidebar'
import { LlamabookHeader } from '@/widgets/llamabook-header'
import { DashboardView } from '@/widgets/llamabook-dashboard-view'
import { ChatView } from '@/widgets/llamabook-chat-view'
import { LlamabookDock } from '@/widgets/llamabook-dock'
import { StatusBar } from '@/widgets/llamabook-status-bar'
import '@/app/styles/llamabook-base.css'
import '@/app/styles/llamabook-theme.css'
import './LlamabookDashboard.css'

function DashboardContent() {
  const { sidebarOpen, mobileSidebarOpen, closeMobileSidebar } = useLlamabookDashboard()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        closeMobileSidebar()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [closeMobileSidebar])

  return (
    <div className={clsx('llamabook-app', !sidebarOpen && 'sidebar-closed')}>
      <div
        className={clsx('llamabook-sidebar', mobileSidebarOpen && 'mobile-open')}
      >
        <LlamabookSidebar />
      </div>

      <div
        className={clsx('mobile-overlay', mobileSidebarOpen && 'visible')}
        onClick={closeMobileSidebar}
      />

      <div className="llamabook-main">
        <LlamabookHeader />
        <DashboardView />
        <ChatView />
        <LlamabookDock />
        <StatusBar />
      </div>
    </div>
  )
}

export function LlamabookDashboard() {
  return (
    <LlamabookDashboardProvider>
      <DashboardContent />
    </LlamabookDashboardProvider>
  )
}
