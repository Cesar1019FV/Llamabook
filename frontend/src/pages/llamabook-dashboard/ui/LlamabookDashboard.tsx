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
    <div className="relative flex h-dvh overflow-hidden bg-llama-bg">
      <aside
        className={clsx(
          'hidden md:flex flex-col overflow-hidden bg-llama-sidebar h-dvh shrink-0 transition-[width] duration-200 ease-out',
          sidebarOpen ? 'w-[var(--sidebar-w)]' : 'w-0'
        )}
      >
        <div className="min-w-[var(--sidebar-w)] flex flex-col h-full">
          <LlamabookSidebar />
        </div>
      </aside>

      <aside
        className={clsx(
          'md:hidden fixed left-0 top-0 z-[60] h-dvh w-[var(--sidebar-w)] bg-llama-sidebar transition-transform duration-200 ease-out',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="min-w-[var(--sidebar-w)] flex flex-col h-full">
          <LlamabookSidebar />
        </div>
      </aside>

      <div
        className={clsx(
          'md:hidden fixed inset-0 z-[59] bg-black/45 transition-opacity duration-150',
          mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMobileSidebar}
      />

      <main className="flex flex-col min-w-0 flex-1 h-dvh overflow-hidden">
        <LlamabookHeader />
        <div className="flex-1 min-h-0 overflow-hidden">
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
