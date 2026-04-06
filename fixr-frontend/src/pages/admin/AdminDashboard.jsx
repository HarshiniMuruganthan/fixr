import { Link } from 'react-router-dom'
import { adminAPI } from '../../api/admin'
import useApi from '../../hooks/useApi'
import { StatsCard, StatusBadge, Avatar, CardSkeleton } from '../../components/ui'
import { timeAgo } from '../../utils/helpers'

export default function AdminDashboard() {
  const { data: users   = [], loading: lu } = useApi(() => adminAPI.getUsers(), [], { defaultData: [] })
  const { data: repairs = [], loading: lr } = useApi(() => adminAPI.getRepairs(), [], { defaultData: [] })
  const loading = lu || lr

  const stats = {
    customers:  users.filter(u => u.role === 'user').length,
    techs:      users.filter(u => u.role === 'technician').length,
    total:      repairs.length,
    open:       repairs.filter(r => r.status === 'open').length,
    inProgress: repairs.filter(r => r.status === 'in_progress').length,
    completed:  repairs.filter(r => r.status === 'completed').length,
    suspended:  users.filter(u => u.isSuspended).length,
    verified:   users.filter(u => u.role === 'technician' && u.isVerified).length,
  }

  const completionRate = stats.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0

  return (
    <div className="p-5 sm:p-7 max-w-6xl mx-auto space-y-7">
      <div className="animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">Platform Overview</h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">
          Live metrics across all users and repair activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Customers"      value={loading ? '—' : stats.customers}  icon="👤" color="blue"    />
        <StatsCard label="Technicians"    value={loading ? '—' : stats.techs}      icon="🔧" color="brand"   />
        <StatsCard label="Total Repairs"  value={loading ? '—' : stats.total}      icon="📋" color="amber"   />
        <StatsCard label="Completion Rate" value={loading ? '—' : `${completionRate}%`} icon="✅" color="emerald" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Open',        value: stats.open,       color: 'bg-emerald-500/10 text-emerald-600' },
          { label: 'In Progress', value: stats.inProgress, color: 'bg-blue-500/10 text-blue-600'       },
          { label: 'Completed',   value: stats.completed,  color: 'bg-brand-500/10 text-brand-600'     },
          { label: 'Verified Techs', value: stats.verified, color: 'bg-cyan-500/10 text-cyan-600'       },
          { label: 'Suspended',   value: stats.suspended,  color: 'bg-rose-500/10 text-rose-600'       },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color} animate-in`}>
            <div className="text-2xl font-display font-bold">{loading ? '—' : s.value}</div>
            <div className="text-xs font-medium mt-0.5 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent repairs */}
        <div className="animate-in stagger-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100">Recent Repairs</h2>
            <Link to="/admin/repairs" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">View all →</Link>
          </div>
          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-3">{[1,2,3,4].map(i => <CardSkeleton key={i} />)}</div>
            ) : (
              <div className="divide-y divide-dark-100 dark:divide-dark-800">
                {repairs.slice(0, 6).map(r => (
                  <div key={r._id} className="flex items-center gap-3 px-4 py-3 hover:bg-dark-50 dark:hover:bg-dark-800/40 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-sm shrink-0">🔧</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-800 dark:text-dark-200 truncate">{r.title}</p>
                      <p className="text-xs text-dark-400 dark:text-dark-500">
                        {r.user?.name} · {timeAgo(r.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent users */}
        <div className="animate-in stagger-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100">Recent Users</h2>
            <Link to="/admin/users" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">View all →</Link>
          </div>
          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-3">{[1,2,3,4].map(i => <CardSkeleton key={i} />)}</div>
            ) : (
              <div className="divide-y divide-dark-100 dark:divide-dark-800">
                {users.slice(0, 6).map(u => (
                  <div key={u._id} className="flex items-center gap-3 px-4 py-3 hover:bg-dark-50 dark:hover:bg-dark-800/40 transition-colors">
                    <Avatar name={u.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-800 dark:text-dark-200 truncate">{u.name}</p>
                      <p className="text-xs text-dark-400 dark:text-dark-500 truncate">{u.email}</p>
                    </div>
                    <span className={`badge capitalize ${
                      u.role === 'admin'      ? 'badge-red'  :
                      u.role === 'technician' ? 'badge-blue' : 'badge-green'
                    }`}>{u.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
