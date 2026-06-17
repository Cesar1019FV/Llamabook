import { useEffect } from 'react'
import clsx from 'clsx'
import { LlamabookDashboardProvider, useLlamabookDashboard } from '@/app/providers'
import { LlamabookSidebar } from '@/widgets/llamabook-sidebar'
import { LlamabookHeader } from '@/widgets/llamabook-header'
import { DashboardView } from '@/widgets/llamabook-dashboard-view'
import { ChatView } from '@/widgets/llamabook-chat-view'
import { LlamabookDock } from '@/widgets/llamabook-dock'
import { StatusBar } from '@/widgets/llamabook-status-bar'

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
    <div
      className={clsx(
        'grid h-dvh transition-[grid-template-columns] duration-200 ease-out',
        'grid-cols-[0_1fr]',
        sidebarOpen ? 'md:grid-cols-[var(--sidebar-w)_1fr]' : 'md:grid-cols-[0_1fr]'
      )}
    >
      <aside
        className={clsx(
          'bg-llama-sidebar flex flex-col overflow-hidden min-w-0 h-dvh',
          'fixed left-0 top-0 z-[60] w-[var(--sidebar-w)] -translate-x-full transition-transform duration-200 ease-out',
          'md:static md:translate-x-0',
          mobileSidebarOpen && 'translate-x-0'
        )}
      >
        <div className="min-w-[var(--sidebar-w)] flex flex-col h-full">
          <LlamabookSidebar />
        </div>
      </aside>

      <div
        className={clsx(
          'fixed inset-0 z-[59] bg-black/45 opacity-0 pointer-events-none transition-opacity duration-150 md:hidden',
          mobileSidebarOpen && 'opacity-100 pointer-events-auto'
        )}
        onClick={closeMobileSidebar}
      />

      <main className="flex flex-col min-w-0 bg-llama-bg overflow-hidden h-dvh">
        <LlamabookHeader />
        <div className="flex-1 min-h-0 relative">
          <DashboardView />
          <ChatView />
        </div>
        <LlamabookDock />
        <StatusBar />
      </main>
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
