import { Link } from 'react-router-dom'
import { StatusBadge } from './ui'
import { formatCurrency, timeAgo } from '../utils/helpers'

export default function RepairCard({ repair, linkTo, showUser = false }) {
  const statusColors = {
    open:        'from-emerald-500/10 to-emerald-500/5',
    in_progress: 'from-blue-500/10 to-blue-500/5',
    completed:   'from-brand-500/10 to-brand-500/5',
    pending:     'from-amber-500/10 to-amber-500/5',
  }
  const gradient = statusColors[repair.status] || 'from-dark-100/50 to-dark-50/50'

  return (
    <Link
      to={linkTo}
      className="card card-hover block group overflow-hidden"
    >
      {/* Color accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-sm text-dark-900 dark:text-dark-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
              {repair.title}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <StatusBadge status={repair.status} />
              {repair.location && (
                <span className="text-xs text-dark-400 dark:text-dark-500 truncate max-w-[140px]">📍 {repair.location}</span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display font-bold text-base text-brand-600 dark:text-brand-400">
              {formatCurrency(repair.budget)}
            </div>
            <div className="text-xs text-dark-400 dark:text-dark-500">{timeAgo(repair.createdAt)}</div>
          </div>
        </div>

        {repair.description && (
          <p className="text-xs text-dark-400 dark:text-dark-500 mt-2.5 line-clamp-2 leading-relaxed">
            {repair.description}
          </p>
        )}

        {showUser && repair.user && (
          <div className="mt-3 pt-3 border-t border-dark-100 dark:border-dark-800 flex items-center justify-between">
            <span className="text-xs text-dark-400 dark:text-dark-500">
              Posted by <span className="font-medium text-dark-600 dark:text-dark-300">{repair.user.name}</span>
            </span>
            <span className="text-xs text-brand-500 group-hover:underline font-medium">View →</span>
          </div>
        )}
      </div>
    </Link>
  )
}
