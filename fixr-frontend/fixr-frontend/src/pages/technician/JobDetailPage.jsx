import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { repairsAPI } from '../../api/repairs'
import { useAuth } from '../../context/AuthContext'
import { Spinner, StatusBadge, Avatar, ConfirmDialog } from '../../components/ui'
import { formatCurrency, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const load = () => {
    repairsAPI.getAssigned()
      .then(r => setJob(r.data.find(j => j._id === id) || null))
      .finally(() => setLoading(false))
  }
  useEffect(load, [id])

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await repairsAPI.complete(id)
      toast.success('Job marked as completed!')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete job')
    } finally {
      setCompleting(false)
    }
  }

  if (loading) return <div className="flex justify-center pt-16"><Spinner size="lg" /></div>
  if (!job) return (
    <div className="p-7 text-center">
      <p className="text-dark-400">Job not found.</p>
      <Link to="/my-jobs" className="btn-secondary mt-3 inline-flex text-sm">← My Jobs</Link>
    </div>
  )

  return (
    <div className="p-5 sm:p-7 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm mb-5 -ml-2">← Back to jobs</button>

      <div className="card p-6 mb-5 animate-in">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <h1 className="font-display text-xl font-bold text-dark-900 dark:text-dark-100">{job.title}</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <StatusBadge status={job.status} />
              <span className="text-xs text-dark-400 dark:text-dark-500">{formatDate(job.createdAt)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-display font-bold text-brand-600 dark:text-brand-400">{formatCurrency(job.budget)}</div>
          </div>
        </div>

        {job.location && (
          <div className="flex items-center gap-1.5 text-sm text-dark-500 dark:text-dark-400 mb-3">
            <span>📍</span> {job.location}
          </div>
        )}

        <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed">{job.description}</p>

        {/* Customer */}
        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-dark-100 dark:border-dark-800">
          <Avatar name={job.user?.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-dark-800 dark:text-dark-200">{job.user?.name}</p>
            <p className="text-xs text-dark-400 dark:text-dark-500">{job.user?.email}</p>
          </div>
          <Link to={`/chat?with=${job.user?._id}`} className="ml-auto btn-secondary text-xs py-1.5">💬 Chat</Link>
        </div>
      </div>

      {job.status === 'in_progress' && (
        <div className="animate-in stagger-1">
          <button onClick={() => setConfirmOpen(true)} className="btn-primary w-full justify-center py-3 bg-emerald-500 hover:bg-emerald-600">
            ✅ Mark Job as Completed
          </button>
        </div>
      )}

      {job.status === 'completed' && (
        <div className="card p-4 text-center animate-in stagger-1">
          <p className="text-2xl mb-1">🎉</p>
          <p className="font-medium text-sm text-dark-800 dark:text-dark-200">Job completed successfully!</p>
          <p className="text-xs text-dark-400 dark:text-dark-500 mt-0.5">The customer may leave you a review.</p>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleComplete}
        title="Complete this job?"
        message="This will mark the repair as completed. The customer will be notified and may leave a review."
        confirmLabel="Yes, Complete"
      />
    </div>
  )
}
