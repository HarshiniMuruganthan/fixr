import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { repairsAPI } from '../../api/repairs'
import { Spinner } from '../../components/ui'
import toast from 'react-hot-toast'

export default function PostRepairPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', location: '', budget: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const payload = { ...form, budget: form.budget ? Number(form.budget) : undefined }
      await repairsAPI.create(payload)
      toast.success('Repair request posted! Technicians will start bidding soon.')
      navigate('/my-requests')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 sm:p-7 max-w-2xl mx-auto">
      <div className="mb-7 animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">Post a Repair Request</h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">Describe your problem and receive competitive bids</p>
      </div>

      <div className="card p-6 animate-in stagger-1">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Refrigerator not cooling properly"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Describe the problem <span className="text-red-400">*</span></label>
            <textarea
              className="input min-h-[120px] resize-none"
              placeholder="Explain what's wrong, when it started, any relevant details…"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Location / Address <span className="text-red-400">*</span></label>
            <input
              type="text"
              className="input"
              placeholder="e.g. 123 Main St, Brooklyn, NY"
              value={form.location}
              onChange={e => set('location', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Budget (USD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 text-sm font-mono">$</span>
              <input
                type="number"
                className="input pl-8"
                placeholder="0"
                min="0"
                value={form.budget}
                onChange={e => set('budget', e.target.value)}
              />
            </div>
            <p className="text-xs text-dark-400 dark:text-dark-500 mt-1.5">Leave blank to receive open bids, or set a max budget</p>
          </div>

          {/* Preview card */}
          {form.title && (
            <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4 animate-in">
              <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mb-1.5">Preview</p>
              <p className="font-medium text-sm text-dark-900 dark:text-dark-100">{form.title}</p>
              {form.description && <p className="text-xs text-dark-400 dark:text-dark-500 mt-0.5 line-clamp-2">{form.description}</p>}
              <div className="flex gap-3 mt-2 text-xs text-dark-400 dark:text-dark-500">
                {form.location && <span>📍 {form.location}</span>}
                {form.budget && <span>💰 ${form.budget}</span>}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1 justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-[2] justify-center"
              disabled={loading}
            >
              {loading ? <><Spinner size="sm" /> Posting…</> : '🚀 Post Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
