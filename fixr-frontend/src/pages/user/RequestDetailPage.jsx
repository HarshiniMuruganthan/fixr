import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { repairsAPI } from '../../api/repairs'
import { bidsAPI } from '../../api/bids'
import { reviewsAPI } from '../../api/reviews'
import { useAuth } from '../../context/AuthContext'
import useApi from '../../hooks/useApi'
import BidCard from '../../components/BidCard'
import { Spinner, StatusBadge, Modal, StarRating, Avatar } from '../../components/ui'
import { formatCurrency, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function RequestDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: repairData = null, loading: loadingRepair, refetch: refetchRepair } =
    useApi(() => repairsAPI.getById(id), [id])
  const { data: bids = [], loading: loadingBids, refetch: refetchBids } =
    useApi(() => bidsAPI.getForRepair(id), [id])
    
  const repair = repairData?.data || repairData
  const loading = loadingRepair || loadingBids

  const [accepting, setAccepting] = useState(null)
  const [reviewModal, setReviewModal] = useState(false)
  const [review, setReview] = useState({ rating: 5, comment: '', technicianId: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  const refetch = useCallback(() => {
    refetchRepair()
    refetchBids()
  }, [refetchRepair, refetchBids])

  const handleAccept = async (bidId) => {
    setAccepting(bidId)
    try {
      await bidsAPI.accept(bidId)
      toast.success('Bid accepted! The technician has been notified.')
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept bid')
    } finally {
      setAccepting(null)
    }
  }

  const handleReview = async () => {
    setSubmittingReview(true)
    try {
      await reviewsAPI.create(review)
      toast.success('Review submitted!')
      setReviewModal(false)
    } catch {
      toast.error('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  )
  if (!repair) return (
    <div className="p-7 text-center">
      <p className="text-dark-400 dark:text-dark-500 mb-3">Request not found.</p>
      <Link to="/my-requests" className="btn-secondary text-sm inline-flex">← Back</Link>
    </div>
  )

  const acceptedBid = bids.find(b => b.status === 'accepted')
  const canAccept = repair.status === 'open'

  return (
    <div className="p-5 sm:p-7 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm mb-5 -ml-2">
        ← Back to requests
      </button>

      {/* Repair detail card */}
      <div className="card p-6 mb-5 animate-in">
        {/* Accent bar */}
        <div className={`-mx-6 -mt-6 mb-5 h-1 rounded-t-2xl bg-gradient-to-r ${
          repair.status === 'open'        ? 'from-emerald-400 to-emerald-500' :
          repair.status === 'in_progress' ? 'from-blue-400 to-blue-500' :
          repair.status === 'completed'   ? 'from-brand-400 to-brand-500' :
                                            'from-amber-400 to-amber-500'
        }`} />

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-display text-xl font-bold text-dark-900 dark:text-dark-100">{repair.title}</h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <StatusBadge status={repair.status} />
              {repair.location && <span className="text-xs text-dark-400 dark:text-dark-500">📍 {repair.location}</span>}
              <span className="text-xs text-dark-400 dark:text-dark-500">{formatDate(repair.createdAt)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-bold text-brand-600 dark:text-brand-400">
              {formatCurrency(repair.budget)}
            </div>
            <div className="text-xs text-dark-400 dark:text-dark-500">your budget</div>
          </div>
        </div>

        <p className="text-sm text-dark-600 dark:text-dark-300 mt-4 leading-relaxed">{repair.description}</p>

        {repair.status === 'completed' && acceptedBid && (
          <button
            onClick={() => {
              setReview(r => ({ ...r, technicianId: acceptedBid.technician?._id || acceptedBid.technician }))
              setReviewModal(true)
            }}
            className="btn-primary text-sm mt-4"
          >
            ⭐ Leave a Review
          </button>
        )}
      </div>

      {/* Accepted bid highlight */}
      {acceptedBid && (
        <div className="card border-brand-500/30 bg-gradient-to-br from-brand-500/5 to-cyan-500/5 p-5 mb-5 animate-in stagger-1">
          <p className="text-xs font-bold text-brand-600 dark:text-brand-400 tracking-wide mb-3">✅ ACCEPTED BID</p>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <Avatar name={acceptedBid.technician?.name} size="md" />
              <div>
                <p className="font-semibold text-sm text-dark-900 dark:text-dark-100">
                  {acceptedBid.technician?.name}
                </p>
                <p className="text-xs text-dark-400 dark:text-dark-500">{acceptedBid.technician?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-display font-bold text-xl text-brand-600 dark:text-brand-400">
                  {formatCurrency(acceptedBid.price)}
                </div>
                <div className="text-xs text-dark-400 dark:text-dark-500">agreed price</div>
              </div>
              <Link
                to={`/chat?with=${acceptedBid.technician?._id || acceptedBid.technician}`}
                className="btn-primary text-xs py-1.5"
              >
                💬 Chat
              </Link>
            </div>
          </div>
          {acceptedBid.message && (
            <p className="text-xs text-dark-500 dark:text-dark-400 mt-3 pt-3 border-t border-brand-500/20 italic">
              "{acceptedBid.message}"
            </p>
          )}
        </div>
      )}

      {/* All bids */}
      <div className="animate-in stagger-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100">
            Bids Received
          </h2>
          <span className="badge badge-brand">{bids.length}</span>
        </div>

        {bids.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-4xl mb-3">⏳</p>
            <p className="font-medium text-sm text-dark-700 dark:text-dark-300">Waiting for bids</p>
            <p className="text-xs text-dark-400 dark:text-dark-500 mt-1">
              Technicians will start bidding on your request soon
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bids.map((bid, i) => (
              <div key={bid._id} className="animate-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <BidCard
                  bid={bid}
                  canAccept={canAccept}
                  onAccept={handleAccept}
                  accepting={accepting === bid._id}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal open={reviewModal} onClose={() => setReviewModal(false)} title="Leave a Review" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Rating</label>
            <StarRating value={review.rating} onChange={v => setReview(r => ({ ...r, rating: v }))} />
          </div>
          <div>
            <label className="label">Comment</label>
            <textarea
              className="input min-h-[100px] resize-none"
              placeholder="Share your experience with this technician…"
              value={review.comment}
              onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn-secondary" onClick={() => setReviewModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleReview} disabled={submittingReview}>
              {submittingReview ? <Spinner size="sm" /> : 'Submit Review'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
