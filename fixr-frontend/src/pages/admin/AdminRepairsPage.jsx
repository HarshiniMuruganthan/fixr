import { useState } from 'react'
import { adminAPI } from '../../api/admin'
import useApi from '../../hooks/useApi'
import { useDebounce } from '../../hooks/useDebounce'
import { StatusBadge, EmptyState } from '../../components/ui'
import { formatCurrency, timeAgo } from '../../utils/helpers'

const STATUS_FILTERS = ['all', 'open', 'in_progress', 'completed', 'pending']

export default function AdminRepairsPage() {
  const { data: repairs = [], loading } = useApi(() => adminAPI.getRepairs(), [], { defaultData: [] })
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const debouncedSearch     = useDebounce(search, 300)

  const filtered = repairs.filter(r => {
    const matchStatus = filter === 'all' || r.status === filter
    const q = debouncedSearch.toLowerCase()
    const matchSearch = !debouncedSearch ||
      r.title?.toLowerCase().includes(q) ||
      r.user?.name?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const counts = STATUS_FILTERS.reduce((a, s) => {
    a[s] = s === 'all' ? repairs.length : repairs.filter(r => r.status === s).length
    return a
  }, {})

  return (
    <div className="p-5 sm:p-7 max-w-5xl mx-auto">
      <div className="mb-6 animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">Repair Requests</h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">{repairs.length} total requests on the platform</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5 animate-in stagger-1">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 text-sm">🔍</span>
          <input className="input pl-9" placeholder="Search by title, user, or location…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-1 p-1 bg-dark-100 dark:bg-dark-800/60 rounded-xl w-fit shrink-0">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-100 shadow-sm'
                  : 'text-dark-500 dark:text-dark-400'
              }`}>
              {f.replace('_', ' ')} <span className="opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="card">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-3 p-4 border-b border-dark-100 dark:border-dark-800">
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 skeleton rounded w-1/3" />
                <div className="h-3 skeleton rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📋" title="No repairs found" description="Adjust your search or filter." />
      ) : (
        <div className="card overflow-hidden animate-in stagger-2">
          <div className="hidden sm:grid grid-cols-[1fr_140px_90px_100px_90px] gap-3 px-4 py-2.5 border-b border-dark-100 dark:border-dark-800 bg-dark-50 dark:bg-dark-900/50">
            {['Title / Customer', 'Location', 'Budget', 'Status', 'Date'].map(h => (
              <span key={h} className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-wide">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-dark-100 dark:divide-dark-800">
            {filtered.map((r, i) => (
              <div
                key={r._id}
                className="flex sm:grid sm:grid-cols-[1fr_140px_90px_100px_90px] items-center gap-3 px-4 py-3 hover:bg-dark-50 dark:hover:bg-dark-800/40 transition-colors animate-in"
                style={{ animationDelay: `${i * 0.02}s` }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-dark-900 dark:text-dark-100 truncate">{r.title}</p>
                  <p className="text-xs text-dark-400 dark:text-dark-500">👤 {r.user?.name}</p>
                </div>
                <p className="hidden sm:block text-xs text-dark-500 dark:text-dark-400 truncate">
                  {r.location ? `📍 ${r.location}` : '—'}
                </p>
                <p className="hidden sm:block text-sm font-medium text-dark-700 dark:text-dark-300">
                  {formatCurrency(r.budget)}
                </p>
                <div><StatusBadge status={r.status} /></div>
                <p className="hidden sm:block text-xs text-dark-400 dark:text-dark-500">{timeAgo(r.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
