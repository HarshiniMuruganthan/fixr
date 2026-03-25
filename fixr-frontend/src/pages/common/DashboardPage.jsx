import { useAuth } from '../../context/AuthContext'
import UserDashboard from '../user/UserDashboard'
import TechnicianDashboard from '../technician/TechnicianDashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  if (user?.role === 'technician') return <TechnicianDashboard />
  return <UserDashboard />
}
