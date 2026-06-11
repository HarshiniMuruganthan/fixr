import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { techniciansAPI } from '../../api/technicians'
import { useAuth } from '../../context/AuthContext'
import { Avatar, StarRating, Modal, Spinner, EmptyState } from '../../components/ui'
import ReviewCard from '../../components/ReviewCard'
import { reviewsAPI } from '../../api/reviews'
import toast from 'react-hot-toast'

export default function TechnicianProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [profile, setProfile]     = useState(null)
  const [reviews, setReviews]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [reviewModal, setReviewModal] = useState(false)
  const [form, setForm]           = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    techniciansAPI.getById(id)
      .then(res => {
        setProfile(res.data.technician)
        setReviews(res.data.reviews || [])
      })
      .catch(() => toast.error('Could not load profile'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const handleReview = async () => {
    setSubmitting(true)
    try {
      await reviewsAPI.create({ technicianId: id, ...form })
      toast.success('Review submitted!')
      setReviewModal(false)
      load()
    } catch {
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center pt-20"><Spinner size="lg" /></div>
  )
  if (!profile) return (
    <div className="p-7 text-center">
      <p className="text-dark-400 mb-3">Technician not found.</p>
      <button onClick={() => navigate(-1)} className="btn-secondary text-sm">← Go Back</button>
    </div>
  )

  return (
    <div className="p-5 sm:p-7 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm mb-5 -ml-2">← Back</button>

      {/* Profile header */}
      <div className="card p-6 mb-5 animate-in">
        <div className="flex items-start gap-5 flex-wrap">
          <Avatar name={profile.name} size="lg" className="w-16 h-16 text-xl" />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl font-bold text-dark-900 dark:text-dark-100">{profile.name}</h1>

            {profile.service && (
              <span className="badge badge-brand mt-1">{profile.service}</span>
            )}

            <div className="flex items-center flex-wrap gap-3 mt-2 text-sm text-dark-500 dark:text-dark-400">
              {profile.location?.city && (
                <span>📍 {profile.location.city}{profile.location.area ? `, ${profile.location.area}` : ''}</span>
              )}
              {profile.yearsOfExperience && (
                <span>⏱ {profile.yearsOfExperience} year{profile.yearsOfExperience !== 1 ? 's' : ''} experience</span>
              )}
            </div>

            {avgRating && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating value={Math.round(parseFloat(avgRating))} readonly />
                <span className="text-sm font-medium text-dark-700 dark:text-dark-300">{avgRating}</span>
                <span className="text-xs text-dark-400 dark:text-dark-500">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}
          </div>
        </div>

        {profile.bio && (
          <div className="mt-4 pt-4 border-t border-dark-100 dark:border-dark-800">
            <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dark-100 dark:border-dark-800">
          <Link to={`/chat?with=${profile._id}`} className="btn-primary text-sm">
            💬 Send Message
          </Link>
          {user?.role === 'user' && (
            <button onClick={() => setReviewModal(true)} className="btn-secondary text-sm">
              ⭐ Write a Review
            </button>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="animate-in stagger-2">
        <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100 mb-3">
          Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <EmptyState
            icon="⭐"
            title="No reviews yet"
            description="Be the first to review this technician."
            action={
              user?.role === 'user' && (
                <button onClick={() => setReviewModal(true)} className="btn-primary text-sm">Write a Review</button>
              )
            }
          />
        ) : (
          <div className="space-y-3">
            {reviews.map((r, i) => (
              <div key={r._id} className="animate-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <ReviewCard review={r} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal open={reviewModal} onClose={() => setReviewModal(false)} title={`Review ${profile.name}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Rating</label>
            <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
          </div>
          <div>
            <label className="label">Your Review</label>
            <textarea
              className="input min-h-[100px] resize-none"
              placeholder={`Share your experience with ${profile.name}…`}
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn-secondary" onClick={() => setReviewModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleReview} disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : 'Submit Review'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
