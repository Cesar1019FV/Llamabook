import { useState, useCallback } from 'react'

export function useSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), [])
  const openMobileSidebar = useCallback(() => setMobileSidebarOpen(true), [])
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), [])

  return {
    sidebarOpen,
    mobileSidebarOpen,
    setSidebarOpen,
    setMobileSidebarOpen,
    toggleSidebar,
    openMobileSidebar,
    closeMobileSidebar,
  }
}
