import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { repairsAPI } from '../../api/repairs'
import { bidsAPI } from '../../api/bids'
import { useAuth } from '../../context/AuthContext'
import { Spinner, StatusBadge, Avatar, Modal } from '../../components/ui'
import { formatCurrency, formatDate, timeAgo } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function TechRepairDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [repair, setRepair] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [bidModal, setBidModal] = useState(false)
  const [bidForm, setBidForm] = useState({ price: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [completing, setCompleting] = useState(false)

  const load = async () => {
    try {
      const [repairRes, bidsRes] = await Promise.all([
        repairsAPI.getById(id),
        bidsAPI.getForRepair(id),
      ])
      setRepair(repairRes.data)
      setBids(bidsRes.data)
    } catch {
      toast.error('Failed to load request')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const myBid = bids.find(b => (b.technician?._id || b.technician) === user._id)

  const handleBid = async () => {
    if (!bidForm.price) return toast.error('Please enter a price')
    setSubmitting(true)
    try {
      await bidsAPI.create({
        repairRequestId: id,
        price: Number(bidForm.price),
        message: bidForm.message,
      })
      toast.success('Bid placed successfully!')
      setBidModal(false)
      setBidForm({ price: '', message: '' })
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place bid')
    } finally {
      setSubmitting(false)
    }
  }

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await repairsAPI.complete(id)
      toast.success('Job marked as completed!')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Not authorized to complete this job')
    } finally {
      setCompleting(false)
    }
  }

  if (loading) return <div className="flex justify-center pt-16"><Spinner size="lg" /></div>
  if (!repair) return (
    <div className="p-7 text-center">
      <p className="text-dark-400">Request not found.</p>
      <Link to="/browse" className="btn-secondary mt-3 text-sm inline-flex">← Browse requests</Link>
    </div>
  )

  const isAssigned = repair.assignedTechnician === user._id ||
    repair.assignedTechnician?._id === user._id

  return (
    <div className="p-5 sm:p-7 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm mb-5 -ml-2">← Back</button>

      {/* Repair card */}
      <div className="card p-6 mb-5 animate-in">
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
            <div className="text-xl font-display font-bold text-brand-600 dark:text-brand-400">{formatCurrency(repair.budget)}</div>
            <div className="text-xs text-dark-400 dark:text-dark-500">Customer budget</div>
          </div>
        </div>

        <p className="text-sm text-dark-600 dark:text-dark-300 mt-4 leading-relaxed">{repair.description}</p>

        {/* Customer info */}
        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-dark-100 dark:border-dark-800">
          <Avatar name={repair.user?.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-dark-800 dark:text-dark-200">{repair.user?.name}</p>
            <p className="text-xs text-dark-400 dark:text-dark-500">{repair.user?.email}</p>
          </div>
          <Link to={`/chat?with=${repair.user?._id}`} className="ml-auto btn-secondary text-xs py-1.5">💬 Chat</Link>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-6 animate-in stagger-1">
        {repair.status === 'open' && !myBid && (
          <button onClick={() => setBidModal(true)} className="btn-primary">💰 Place a Bid</button>
        )}
        {myBid && (
          <div className="card p-4 flex-1 min-w-[200px]">
            <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mb-1">YOUR BID</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-lg text-dark-900 dark:text-dark-100">{formatCurrency(myBid.price)}</p>
                {myBid.message && <p className="text-xs text-dark-400 dark:text-dark-500 line-clamp-1">{myBid.message}</p>}
              </div>
              <StatusBadge status={myBid.status} />
            </div>
          </div>
        )}
        {isAssigned && repair.status === 'in_progress' && (
          <button onClick={handleComplete} disabled={completing} className="btn-primary bg-emerald-500 hover:bg-emerald-600">
            {completing ? <Spinner size="sm" /> : '✅ Mark as Completed'}
          </button>
        )}
      </div>

      {/* All bids */}
      <div className="animate-in stagger-2">
        <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100 mb-3">All Bids ({bids.length})</h2>
        {bids.length === 0 ? (
          <div className="card p-6 text-center text-sm text-dark-400 dark:text-dark-500">No bids yet. Be the first!</div>
        ) : (
          <div className="space-y-3">
            {bids.map(b => (
              <div key={b._id} className={`card p-4 flex items-start gap-3 ${b.status === 'accepted' ? 'border-brand-500/30 bg-brand-500/5' : ''}`}>
                <Avatar name={b.technician?.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-900 dark:text-dark-100">{b.technician?.name}</p>
                  {b.message && <p className="text-xs text-dark-400 dark:text-dark-500 mt-0.5 line-clamp-2">{b.message}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-dark-900 dark:text-dark-100">{formatCurrency(b.price)}</p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bid Modal */}
      <Modal open={bidModal} onClose={() => setBidModal(false)} title="Place Your Bid" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Your Price (USD) <span className="text-red-400">*</span></label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 text-sm font-mono">$</span>
              <input
                type="number"
                className="input pl-8"
                placeholder="0"
                min="1"
                value={bidForm.price}
                onChange={e => setBidForm(f => ({ ...f, price: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="label">Message to Customer</label>
            <textarea
              className="input min-h-[90px] resize-none"
              placeholder="Describe your approach, timeline, warranty…"
              value={bidForm.message}
              onChange={e => setBidForm(f => ({ ...f, message: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn-secondary" onClick={() => setBidModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleBid} disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : '💰 Submit Bid'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
