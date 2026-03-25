import { Link } from 'react-router-dom'
import { repairsAPI } from '../../api/repairs'
import { useAuth } from '../../context/AuthContext'
import useApi from '../../hooks/useApi'
import RepairCard from '../../components/RepairCard'
import { StatsCard, CardSkeleton, EmptyState } from '../../components/ui'
import { formatCurrency } from '../../utils/helpers'

export default function UserDashboard() {
  const { user } = useAuth()
  const { data: repairs = [], loading } = useApi(() => repairsAPI.getMy(), [], { defaultData: [] })

  const stats = {
    total:      repairs.length,
    open:       repairs.filter(r => r.status === 'open').length,
    inProgress: repairs.filter(r => r.status === 'in_progress').length,
    completed:  repairs.filter(r => r.status === 'completed').length,
  }

  const totalSpend = repairs
    .filter(r => r.status === 'completed' && r.budget)
    .reduce((s, r) => s + r.budget, 0)

  return (
    <div className="p-5 sm:p-7 max-w-5xl mx-auto space-y-7">
      {/* Greeting */}
      <div className="animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">
          Good to see you, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">
          Here's an overview of your repair activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Requests" value={stats.total}      icon="📋" color="brand"   />
        <StatsCard label="Open"           value={stats.open}       icon="🟢" color="emerald" />
        <StatsCard label="In Progress"    value={stats.inProgress} icon="⚡" color="blue"    />
        <StatsCard label="Completed"      value={stats.completed}  icon="✅" color="amber"   />
      </div>

      {/* Quick actions */}
      <div className="card p-5 animate-in stagger-2">
        <h2 className="font-display font-semibold text-sm text-dark-900 dark:text-dark-100 mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link to="/post-repair"   className="btn-primary text-sm py-2">＋ Post New Repair</Link>
          <Link to="/my-requests"   className="btn-secondary text-sm py-2">📋 My Requests</Link>
          <Link to="/technicians"   className="btn-secondary text-sm py-2">👥 Find Technicians</Link>
          <Link to="/chat"          className="btn-secondary text-sm py-2">💬 Messages</Link>
        </div>
      </div>

      {/* Spend summary */}
      {totalSpend > 0 && (
        <div className="card p-5 bg-gradient-to-br from-brand-500/5 to-cyan-500/5 border-brand-500/20 animate-in stagger-3">
          <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mb-1">TOTAL SPENT ON REPAIRS</p>
          <p className="font-display text-3xl font-bold text-dark-900 dark:text-dark-100">
            {formatCurrency(totalSpend)}
          </p>
          <p className="text-xs text-dark-400 dark:text-dark-500 mt-1">
            Across {stats.completed} completed repair{stats.completed !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Recent requests */}
      <div className="animate-in stagger-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100">Recent Requests</h2>
          <Link to="/my-requests" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <CardSkeleton key={i} />)}</div>
        ) : repairs.length === 0 ? (
          <EmptyState
            icon="🔧"
            title="No repair requests yet"
            description="Post your first repair request and receive bids from local technicians."
            action={<Link to="/post-repair" className="btn-primary text-sm">Post a Repair</Link>}
          />
        ) : (
          <div className="space-y-3">
            {repairs.slice(0, 5).map((r, i) => (
              <div key={r._id} className="animate-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <RepairCard repair={r} linkTo={`/my-requests/${r._id}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
