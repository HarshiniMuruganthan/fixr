import { Avatar, StarRating } from './ui'
import { formatDate } from '../utils/helpers'

export default function ReviewCard({ review }) {
  return (
    <div className="card p-5">
      <div className="flex items-start gap-3">
        <Avatar name={review.user?.name} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-medium text-sm text-dark-900 dark:text-dark-100">
              {review.user?.name || 'Anonymous'}
            </span>
            <span className="text-xs text-dark-400 dark:text-dark-500">{formatDate(review.createdAt)}</span>
          </div>
          <div className="mt-1">
            <StarRating value={review.rating} readonly />
          </div>
          {review.comment && (
            <p className="text-sm text-dark-600 dark:text-dark-300 mt-2 leading-relaxed">{review.comment}</p>
          )}
        </div>
      </div>
    </div>
  )
}
