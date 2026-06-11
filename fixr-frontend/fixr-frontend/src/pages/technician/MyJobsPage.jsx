import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { repairsAPI } from '../../api/repairs'
import { CardSkeleton, EmptyState, StatusBadge } from '../../components/ui'
import { formatCurrency, formatDate, timeAgo } from '../../utils/helpers'

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    repairsAPI.getAssigned()
      .then(r => setJobs(r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-5 sm:p-7 max-w-4xl mx-auto">
      <div className="mb-6 animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">My Jobs</h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">
          {jobs.filter(j => j.status === 'in_progress').length} active · {jobs.filter(j => j.status === 'completed').length} completed
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <CardSkeleton key={i} />)}</div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon="💼"
          title="No jobs yet"
          description="Browse open requests and place bids to get hired."
          action={<Link to="/browse" className="btn-primary text-sm">Browse Requests</Link>}
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((j, i) => (
            <Link
              key={j._id}
              to={`/my-jobs/${j._id}`}
              className="card card-hover p-5 flex items-start gap-4 block group animate-in"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                j.status === 'completed' ? 'bg-emerald-500/10' : 'bg-blue-500/10'
              }`}>
                {j.status === 'completed' ? '✅' : '⚡'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-display font-semibold text-sm text-dark-900 dark:text-dark-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {j.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <StatusBadge status={j.status} />
                      <span className="text-xs text-dark-400 dark:text-dark-500">👤 {j.user?.name}</span>
                      <span className="text-xs text-dark-400 dark:text-dark-500">📍 {j.location}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-display font-bold text-dark-900 dark:text-dark-100">{formatCurrency(j.budget)}</div>
                    <div className="text-xs text-dark-400 dark:text-dark-500">{timeAgo(j.createdAt)}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
