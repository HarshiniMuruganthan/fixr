import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-dark-50 dark:bg-dark-950">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-dark-950/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 animate-slide-in-right">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-dark-900 border-b border-dark-100 dark:border-dark-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn-ghost p-1.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-cyan-400 flex items-center justify-center text-white font-display font-bold text-xs">F</div>
            <span className="font-display font-bold text-dark-900 dark:text-dark-100">Fixr</span>
          </div>
        </header>

        {/* Desktop topbar */}
        <Topbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
