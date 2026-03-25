import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { repairsAPI } from '../../api/repairs'
import { CardSkeleton, EmptyState, StatusBadge } from '../../components/ui'
import { formatCurrency, formatDate, timeAgo } from '../../utils/helpers'

export default function MyJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusParam = searchParams.get('status')
  
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(
    statusParam === 'completed' ? 'completed' : 'active'
  )

  useEffect(() => {
    repairsAPI.getAssigned()
      .then(r => setJobs(r.data))
      .finally(() => setLoading(false))
  }, [])

  // Sync tab with URL
  useEffect(() => {
    if (statusParam === 'completed') setActiveTab('completed')
    if (statusParam === 'active') setActiveTab('active')
  }, [statusParam])

  const filteredJobs = jobs.filter(j => 
    activeTab === 'active' ? j.status === 'in_progress' : j.status === 'completed'
  )

  const counts = {
    active: jobs.filter(j => j.status === 'in_progress').length,
    completed: jobs.filter(j => j.status === 'completed').length
  }

  return (
    <div className="p-5 sm:p-7 max-w-4xl mx-auto">
      <div className="mb-6 animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">My Jobs</h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">
          Manage your current projects and view history
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-dark-100 dark:bg-dark-900 rounded-xl mb-6 w-fit animate-in stagger-1">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'active' 
              ? 'bg-white dark:bg-dark-800 text-brand-600 dark:text-brand-400 shadow-sm' 
              : 'text-dark-500 dark:text-dark-400 hover:text-dark-700 dark:hover:text-dark-200'
          }`}
        >
          Active Jobs ({counts.active})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'completed' 
              ? 'bg-white dark:bg-dark-800 text-brand-600 dark:text-brand-400 shadow-sm' 
              : 'text-dark-500 dark:text-dark-400 hover:text-dark-700 dark:hover:text-dark-200'
          }`}
        >
          Completed Jobs ({counts.completed})
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <CardSkeleton key={i} />)}</div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={activeTab === 'active' ? '⚡' : '✅'}
          title={activeTab === 'active' ? 'No active jobs' : 'No completed jobs'}
          description={activeTab === 'active' ? 'Browse requests and place bids to get hired.' : 'Jobs you mark as completed will appear here.'}
          action={activeTab === 'active' ? <Link to="/browse" className="btn-primary text-sm">Browse Requests</Link> : null}
        />
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((j, i) => (
            <Link
              key={j._id}
              to={`/my-jobs/${j._id}`}
              className="card card-hover p-4 sm:p-5 flex items-start gap-4 block group animate-in"
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
                      <span className="text-xs text-dark-400 dark:text-dark-500 text-truncate max-w-[150px]">📍 {j.location}</span>
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
