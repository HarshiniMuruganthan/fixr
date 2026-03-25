import { Link, useSearchParams } from 'react-router-dom'
import { repairsAPI } from '../../api/repairs'
import useApi from '../../hooks/useApi'
import RepairCard from '../../components/RepairCard'
import { CardSkeleton, EmptyState } from '../../components/ui'
import { useState, useEffect } from 'react'

const FILTERS = ['all', 'open', 'in_progress', 'completed']

export default function MyRequestsPage() {
  const [searchParams] = useSearchParams()
  const statusParam = searchParams.get('status')
  
  const { data: repairs = [], loading } = useApi(() => repairsAPI.getMy(), [], { defaultData: [] })
  const [filter, setFilter] = useState(statusParam || 'all')

  // Sync filter with URL
  useEffect(() => {
    if (statusParam && FILTERS.includes(statusParam)) {
      setFilter(statusParam)
    }
  }, [statusParam])

  const filtered = filter === 'all' ? repairs : repairs.filter(r => r.status === filter)

  return (
    <div className="p-5 sm:p-7 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 animate-in">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">My Requests</h1>
          <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">{repairs.length} total repair requests</p>
        </div>
        <Link to="/post-repair" className="btn-primary text-sm">＋ New Request</Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-dark-100 dark:bg-dark-800/60 rounded-xl mb-6 w-fit animate-in stagger-1">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
              filter === f
                ? 'bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-100 shadow-sm'
                : 'text-dark-500 dark:text-dark-400 hover:text-dark-700 dark:hover:text-dark-200'
            }`}
          >
            {f.replace('_', ' ')}
            <span className="ml-1.5 opacity-60">
              {f === 'all' ? repairs.length : repairs.filter(r => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <CardSkeleton key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔧"
          title={filter === 'all' ? 'No requests yet' : `No ${filter.replace('_',' ')} requests`}
          description="Post a repair request to get bids from local technicians."
          action={<Link to="/post-repair" className="btn-primary text-sm">Post a Repair</Link>}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((r, i) => (
            <div key={r._id} className="animate-in" style={{ animationDelay: `${i * 0.04}s` }}>
              <RepairCard repair={r} linkTo={`/my-requests/${r._id}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
