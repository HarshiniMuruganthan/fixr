import { Avatar, StatusBadge } from './ui'
import { formatCurrency, timeAgo } from '../utils/helpers'

export default function BidCard({ bid, onAccept, accepting, canAccept }) {
  return (
    <div className={`card p-5 transition-all duration-200 ${bid.status === 'accepted' ? 'ring-1 ring-brand-500/40 bg-brand-500/[0.03]' : ''}`}>
      <div className="flex items-start gap-3">
        <Avatar name={bid.technician?.name} size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-semibold text-sm text-dark-900 dark:text-dark-100">
              {bid.technician?.name}
            </span>
            <StatusBadge status={bid.status} />
          </div>
          <p className="text-xs text-dark-400 dark:text-dark-500 mt-0.5">
            {bid.technician?.service && <span className="mr-2">{bid.technician.service}</span>}
            {timeAgo(bid.createdAt)}
          </p>

          {bid.message && (
            <div className="mt-2.5 p-3 rounded-xl bg-dark-50 dark:bg-dark-800/60 border border-dark-100 dark:border-dark-700">
              <p className="text-xs text-dark-600 dark:text-dark-300 leading-relaxed italic">"{bid.message}"</p>
            </div>
          )}
        </div>

        <div className="text-right shrink-0 flex flex-col items-end gap-2">
          <div>
            <div className="font-display font-bold text-xl text-dark-900 dark:text-dark-100">
              {formatCurrency(bid.price)}
            </div>
            <div className="text-xs text-dark-400 dark:text-dark-500">bid price</div>
          </div>

          {canAccept && bid.status === 'pending' && (
            <button
              onClick={() => onAccept(bid._id)}
              disabled={accepting}
              className="btn-primary text-xs py-1.5 px-3"
            >
              {accepting ? '…' : '✓ Accept'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
