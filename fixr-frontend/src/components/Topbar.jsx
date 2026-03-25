import { useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { Avatar } from './ui'

const routeTitles = {
  '/dashboard':       { title: 'Dashboard',           sub: 'Overview of your activity' },
  '/post-repair':     { title: 'Post a Repair',        sub: 'Describe your problem and get bids' },
  '/my-requests':     { title: 'My Requests',          sub: 'Track all your repair requests' },
  '/chat':            { title: 'Messages',             sub: 'Real-time chat with technicians' },
  '/profile':         { title: 'Profile Settings',     sub: 'Manage your account' },
  '/browse':          { title: 'Browse Requests',      sub: 'Find jobs in your area' },
  '/my-bids':         { title: 'My Bids',              sub: 'Track bids you have placed' },
  '/my-jobs':         { title: 'My Jobs',              sub: 'Jobs assigned to you' },
  '/admin':           { title: 'Platform Overview',    sub: 'Real-time metrics and activity' },
  '/admin/users':     { title: 'User Management',      sub: 'Manage all platform accounts' },
  '/admin/repairs':   { title: 'Repair Requests',      sub: 'All repair activity on the platform' },
  '/admin/reports':   { title: 'Reports & Analytics',  sub: 'Platform health and insights' },
}

export default function Topbar() {
  const { pathname } = useLocation()
  const { dark, toggle } = useTheme()
  const { user } = useAuth()

  // Match dynamic routes too (e.g. /my-requests/123)
  const base = '/' + pathname.split('/').slice(1, 3).join('/')
  const meta = routeTitles[pathname] || routeTitles[base] || routeTitles['/' + pathname.split('/')[1]] || { title: 'Fixr', sub: '' }

  return (
    <header className="sticky top-0 z-20 hidden lg:flex items-center justify-between px-7 py-4 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-dark-100 dark:border-dark-800">
      <div>
        <h2 className="font-display font-bold text-lg text-dark-900 dark:text-dark-100 leading-tight">{meta.title}</h2>
        {meta.sub && <p className="text-xs text-dark-400 dark:text-dark-500 mt-0.5">{meta.sub}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors text-sm"
          title="Toggle theme"
        >
          {dark ? '☀️' : '🌙'}
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-dark-100 dark:border-dark-800">
          <Avatar name={user?.name} size="sm" />
          <div className="hidden xl:block">
            <p className="text-xs font-semibold text-dark-800 dark:text-dark-200">{user?.name}</p>
            <p className="text-xs text-dark-400 dark:text-dark-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
