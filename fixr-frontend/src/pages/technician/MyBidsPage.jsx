import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { repairsAPI } from '../../api/repairs'
import { bidsAPI } from '../../api/bids'
import { useAuth } from '../../context/AuthContext'
import { CardSkeleton, EmptyState, StatusBadge } from '../../components/ui'
import { formatCurrency, timeAgo } from '../../utils/helpers'

export default function MyBidsPage() {
  const { user } = useAuth()
  const [bidsWithRepairs, setBidsWithRepairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    bidsAPI.getMy()
      .then(res => setBidsWithRepairs(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? bidsWithRepairs : bidsWithRepairs.filter(b => b.status === filter)

  return (
    <div className="p-5 sm:p-7 max-w-4xl mx-auto">
      <div className="mb-6 animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">My Bids</h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">{bidsWithRepairs.length} bids placed</p>
      </div>

      {/* Filter */}
      <div className="flex gap-1 p-1 bg-dark-100 dark:bg-dark-800/60 rounded-xl mb-5 w-fit animate-in stagger-1">
        {['all', 'pending', 'accepted', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
              filter === f
                ? 'bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-100 shadow-sm'
                : 'text-dark-500 dark:text-dark-400 hover:text-dark-700'
            }`}
          >
            {f}
            <span className="ml-1.5 opacity-60">
              {f === 'all' ? bidsWithRepairs.length : bidsWithRepairs.filter(b => b.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <CardSkeleton key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No bids found"
          description="Browse open requests and place your first bid."
          action={<Link to="/browse" className="btn-primary text-sm">Browse Requests</Link>}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((b, i) => (
            <Link
              key={b._id}
              to={`/browse/${b.repairRequest._id}`}
              className="card card-hover p-5 flex items-start gap-4 block group animate-in"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-xl shrink-0">🔧</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-display font-semibold text-sm text-dark-900 dark:text-dark-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                      {b.repairRequest.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <StatusBadge status={b.status} />
                      <span className="text-xs text-dark-400 dark:text-dark-500">📍 {b.repairRequest.location}</span>
                      <span className="text-xs text-dark-400 dark:text-dark-500">{timeAgo(b.createdAt)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display font-bold text-base text-brand-600 dark:text-brand-400">Your bid: {formatCurrency(b.price)}</div>
                    <div className="text-xs text-dark-400 dark:text-dark-500">Budget: {formatCurrency(b.repairRequest.budget)}</div>
                  </div>
                </div>
                {b.message && (
                  <p className="text-xs text-dark-400 dark:text-dark-500 mt-2 line-clamp-1">"{b.message}"</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
