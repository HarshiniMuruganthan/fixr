import { Link } from 'react-router-dom'
import { repairsAPI } from '../../api/repairs'
import { useAuth } from '../../context/AuthContext'
import useApi from '../../hooks/useApi'
import RepairCard from '../../components/RepairCard'
import { StatsCard, CardSkeleton, EmptyState } from '../../components/ui'

export default function TechnicianDashboard() {
  const { user } = useAuth()

  const { data: jobs = [],        loading: loadingJobs }    = useApi(() => repairsAPI.getAssigned(), [], { defaultData: [] })
  const { data: allRepairs = [],  loading: loadingAll }     = useApi(() => repairsAPI.getAll(), [], { defaultData: [] })

  const openRepairs = allRepairs.filter(r => r.status === 'open')
  const loading = loadingJobs || loadingAll

  const stats = {
    active:    jobs.filter(j => j.status === 'in_progress').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    open:      openRepairs.length,
  }

  return (
    <div className="p-5 sm:p-7 max-w-5xl mx-auto space-y-7">
      {/* Greeting */}
      <div className="animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">
          Welcome back, {user?.name?.split(' ')[0]} 🔧
        </h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">
          {user?.service && <span className="mr-3">Service: <strong className="text-dark-700 dark:text-dark-300">{user.service}</strong></span>}
          {user?.location?.city && <span>📍 {user.location.city}{user.location.area ? `, ${user.location.area}` : ''}</span>}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard label="Active Jobs"     value={stats.active}    icon="⚡" color="blue"    />
        <StatsCard label="Completed Jobs"  value={stats.completed} icon="✅" color="emerald" />
        <StatsCard label="Open Requests"   value={stats.open}      icon="🔍" color="brand"   />
      </div>

      {/* Quick actions */}
      <div className="card p-5 animate-in stagger-2">
        <h2 className="font-display font-semibold text-sm text-dark-900 dark:text-dark-100 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link to="/browse"     className="btn-primary text-sm py-2">🔍 Browse Requests</Link>
          <Link to="/my-jobs"    className="btn-secondary text-sm py-2">💼 My Jobs</Link>
          <Link to="/my-bids"    className="btn-secondary text-sm py-2">📋 My Bids</Link>
          <Link to="/my-reviews" className="btn-secondary text-sm py-2">⭐ My Reviews</Link>
          <Link to="/chat"       className="btn-secondary text-sm py-2">💬 Messages</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Active jobs */}
        <div className="animate-in stagger-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100">Active Jobs</h2>
            <Link to="/my-jobs" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">All →</Link>
          </div>
          {loadingJobs ? (
            <div className="space-y-3">{[1,2].map(i => <CardSkeleton key={i} />)}</div>
          ) : jobs.filter(j => j.status === 'in_progress').length === 0 ? (
            <EmptyState icon="⚡" title="No active jobs" description="Win bids to start earning." />
          ) : (
            <div className="space-y-3">
              {jobs.filter(j => j.status === 'in_progress').slice(0, 3).map((j, i) => (
                <div key={j._id} className="animate-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <RepairCard repair={j} linkTo={`/my-jobs/${j._id}`} showUser />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed jobs */}
        <div className="animate-in stagger-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100">Recently Completed</h2>
            <Link to="/my-jobs" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">History →</Link>
          </div>
          {loadingJobs ? (
            <div className="space-y-3">{[1,2].map(i => <CardSkeleton key={i} />)}</div>
          ) : jobs.filter(j => j.status === 'completed').length === 0 ? (
            <EmptyState icon="✅" title="No completed jobs" description="Jobs you finish will show up here." />
          ) : (
            <div className="space-y-3">
              {jobs.filter(j => j.status === 'completed').slice(0, 3).map((j, i) => (
                <div key={j._id} className="animate-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <RepairCard repair={j} linkTo={`/my-jobs/${j._id}`} showUser />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New opportunities */}
      <div className="animate-in stagger-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100">New Opportunities</h2>
          <Link to="/browse" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">View All →</Link>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">{[1,2,3,4].map(i => <CardSkeleton key={i} />)}</div>
        ) : openRepairs.length === 0 ? (
          <EmptyState icon="🔍" title="No open requests" description="Check back soon for new jobs." />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {openRepairs.slice(0, 4).map((r, i) => (
              <div key={r._id} className="animate-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <RepairCard repair={r} linkTo={`/browse/${r._id}`} showUser />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
