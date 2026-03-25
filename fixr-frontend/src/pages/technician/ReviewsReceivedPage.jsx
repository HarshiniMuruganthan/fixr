import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { reviewsAPI } from '../../api/reviews'
import ReviewCard from '../../components/ReviewCard'
import { StarRating, EmptyState, Spinner } from '../../components/ui'

export default function ReviewsReceivedPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reviewsAPI.getForTechnician(user._id)
      .then(r => setReviews(r.data))
      .finally(() => setLoading(false))
  }, [user._id])

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : 0

  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0,
  }))

  if (loading) return <div className="flex justify-center pt-16"><Spinner size="lg" /></div>

  return (
    <div className="p-5 sm:p-7 max-w-3xl mx-auto">
      <div className="mb-6 animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">My Reviews</h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">{reviews.length} reviews received</p>
      </div>

      {reviews.length > 0 && (
        <div className="card p-6 mb-5 animate-in stagger-1">
          <div className="flex items-center gap-8 flex-wrap">
            {/* Overall score */}
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-dark-900 dark:text-dark-100">
                {avgRating.toFixed(1)}
              </div>
              <StarRating value={Math.round(avgRating)} readonly />
              <p className="text-xs text-dark-400 dark:text-dark-500 mt-1">{reviews.length} total</p>
            </div>

            {/* Bar breakdown */}
            <div className="flex-1 min-w-[200px] space-y-2">
              {starCounts.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-dark-500 w-6 shrink-0">{star}★</span>
                  <div className="flex-1 h-2 bg-dark-100 dark:bg-dark-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-dark-400 dark:text-dark-500 w-6 text-right shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <EmptyState
          icon="⭐"
          title="No reviews yet"
          description="Complete jobs to start receiving reviews from customers."
        />
      ) : (
        <div className="space-y-3 animate-in stagger-2">
          {reviews.map((r, i) => (
            <div key={r._id} className="animate-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <ReviewCard review={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
