import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Avatar } from './ui'

const userNav = [
  { to: '/dashboard',    icon: '⊞',  label: 'Dashboard' },
  { to: '/post-repair',  icon: '＋',  label: 'Post Repair' },
  { to: '/my-requests',  icon: '🔧', label: 'All Requests' },
  { to: '/my-requests?status=in_progress', icon: '⚡', label: 'Active Repairs' },
  { to: '/my-requests?status=completed',   icon: '✅', label: 'History' },
  { to: '/technicians',  icon: '👥', label: 'Find Technicians' },
  { to: '/chat',         icon: '💬', label: 'Messages' },
]
const techNav = [
  { to: '/dashboard', icon: '⊞',  label: 'Dashboard' },
  { to: '/browse',    icon: '🔍', label: 'Browse Jobs' },
  { to: '/my-bids',   icon: '📋', label: 'My Bids' },
  { to: '/my-jobs',   icon: '💼', label: 'All Jobs' },
  { to: '/my-jobs?status=active',   icon: '⚡', label: 'Active Jobs' },
  { to: '/my-jobs?status=completed', icon: '✅', label: 'Completed Jobs' },
  { to: '/my-reviews',icon: '⭐', label: 'My Reviews' },
  { to: '/chat',      icon: '💬', label: 'Messages' },
]
const adminNav = [
  { to: '/admin',          icon: '⊞',  label: 'Overview' },
  { to: '/admin/users',    icon: '👥', label: 'Users' },
  { to: '/admin/repairs',  icon: '🔧', label: 'Repairs' },
  { to: '/admin/reports',  icon: '📊', label: 'Reports' },
  { to: '/chat',           icon: '💬', label: 'Messages' },
  { to: '/profile',        icon: '⚙',  label: 'Profile' },
]

const roleLabels = { user: 'Customer', technician: 'Technician', admin: 'Administrator' }

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const nav =
    user?.role === 'admin'      ? adminNav :
    user?.role === 'technician' ? techNav  : userNav

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="flex flex-col h-full w-64 bg-white dark:bg-dark-900 border-r border-dark-100 dark:border-dark-800">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-dark-100 dark:border-dark-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-400 flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
            F
          </div>
          <span className="font-display font-bold text-dark-900 dark:text-dark-100 text-lg tracking-tight">Fixr</span>
          <span className="ml-auto text-xs font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded-md shrink-0">
            {roleLabels[user?.role] || ''}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {nav.map(({ to, icon, label }) => (
          <NavLink
            key={to + label}
            to={to}
            end={to === '/dashboard' || to === '/admin'}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span className="text-base w-5 text-center leading-none">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="px-3 py-3 border-t border-dark-100 dark:border-dark-800 space-y-0.5">
        <button onClick={toggle} className="sidebar-link w-full justify-start">
          <span className="text-base w-5 text-center">{dark ? '☀' : '🌙'}</span>
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <span className="text-base w-5 text-center">⏻</span>
          Sign Out
        </button>

        {/* User pill */}
        <div className="flex items-center gap-2.5 px-3 pt-3 mt-1 border-t border-dark-100 dark:border-dark-800">
          <Avatar name={user?.name} size="sm" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-dark-800 dark:text-dark-200 truncate">{user?.name}</p>
            <p className="text-xs text-dark-400 dark:text-dark-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
