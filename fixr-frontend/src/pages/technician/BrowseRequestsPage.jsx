import { useState } from 'react'
import { repairsAPI } from '../../api/repairs'
import useApi from '../../hooks/useApi'
import { useDebounce } from '../../hooks/useDebounce'
import RepairCard from '../../components/RepairCard'
import { CardSkeleton, EmptyState } from '../../components/ui'

export default function BrowseRequestsPage() {
  const { data: allRepairs = [], loading } = useApi(() => repairsAPI.getAll(), [], { defaultData: [] })
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const repairs = allRepairs.filter(r => r.status === 'open')

  const filtered = repairs.filter(r => {
    if (!debouncedSearch) return true
    const q = debouncedSearch.toLowerCase()
    return (
      r.title?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-5 sm:p-7 max-w-4xl mx-auto">
      <div className="mb-6 animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">Browse Requests</h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">
          {repairs.length} open repair requests waiting for bids
        </p>
      </div>

      <div className="relative mb-6 animate-in stagger-1">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400">🔍</span>
        <input
          type="text"
          className="input pl-9"
          placeholder="Search by title, location, or description…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <CardSkeleton key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title={search ? 'No matching requests' : 'No open requests'}
          description={search ? 'Try a different search term.' : 'Check back soon — new requests appear regularly.'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((r, i) => (
            <div key={r._id} className="animate-in" style={{ animationDelay: `${i * 0.04}s` }}>
              <RepairCard repair={r} linkTo={`/browse/${r._id}`} showUser />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
