import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function RoleRoute({ roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) {
    const redirects = { admin: '/admin', technician: '/dashboard', user: '/dashboard' }
    return <Navigate to={redirects[user.role] || '/dashboard'} replace />
  }
  return <Outlet />
}
