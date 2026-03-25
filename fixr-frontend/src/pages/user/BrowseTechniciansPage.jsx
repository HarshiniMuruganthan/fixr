import { useEffect, useState } from 'react'
import { techniciansAPI } from '../../api/technicians'
import { reviewsAPI } from '../../api/reviews'
import TechnicianCard from '../../components/TechnicianCard'
import { Spinner, EmptyState } from '../../components/ui'
import { useDebounce } from '../../hooks/useDebounce'

export default function BrowseTechniciansPage() {
  const [technicians, setTechnicians] = useState([])
  const [ratingsMap, setRatingsMap]   = useState({})
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const debouncedSearch               = useDebounce(search, 300)

  useEffect(() => {
    techniciansAPI.getAll().then(async res => {
      setTechnicians(res.data)
      // Load ratings for all technicians in parallel
      const ratings = {}
      await Promise.allSettled(
        res.data.map(t =>
          reviewsAPI.getForTechnician(t._id).then(r => {
            const revs = r.data
            ratings[t._id] = {
              avg: revs.length ? revs.reduce((s, x) => s + x.rating, 0) / revs.length : null,
              count: revs.length,
            }
          })
        )
      )
      setRatingsMap(ratings)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = technicians.filter(t => {
    if (!debouncedSearch) return true
    const q = debouncedSearch.toLowerCase()
    return (
      t.name?.toLowerCase().includes(q) ||
      t.service?.toLowerCase().includes(q) ||
      t.location?.city?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-5 sm:p-7 max-w-5xl mx-auto">
      <div className="mb-6 animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">Find Technicians</h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">
          {technicians.length} verified technicians available
        </p>
      </div>

      <div className="relative mb-6 animate-in stagger-1">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400">🔍</span>
        <input
          type="text"
          className="input pl-9"
          placeholder="Search by name, service, or city…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card p-5 space-y-3">
              <div className="flex gap-3">
                <div className="w-12 h-12 skeleton rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 skeleton rounded w-2/3" />
                  <div className="h-3 skeleton rounded w-1/3" />
                </div>
              </div>
              <div className="h-3 skeleton rounded w-full" />
              <div className="h-3 skeleton rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No technicians found"
          description={search ? 'Try a different search term.' : 'No technicians registered yet.'}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t, i) => (
            <div key={t._id} className="animate-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <TechnicianCard
                technician={t}
                avgRating={ratingsMap[t._id]?.avg}
                reviewCount={ratingsMap[t._id]?.count || 0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
