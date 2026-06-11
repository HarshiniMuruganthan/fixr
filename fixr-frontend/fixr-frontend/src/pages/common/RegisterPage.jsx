import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Spinner } from '../../components/ui'

const SERVICES = ['Electronics', 'Plumbing', 'Electrical', 'HVAC', 'Appliances', 'Carpentry', 'Auto', 'Mobile Phones']

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: params.get('role') === 'technician' ? 'technician' : 'user',
    service: '',
    city: '',
    area: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await register(form)
    if (res.success) {
      navigate(res.role === 'admin' ? '/admin' : '/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-brand-400/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-400 flex items-center justify-center text-white font-display font-bold">F</div>
          <span className="font-display font-bold text-2xl text-dark-900 dark:text-dark-100">Fixr</span>
        </div>

        <div className="card p-7 animate-in">
          <h1 className="font-display font-bold text-xl text-dark-900 dark:text-dark-100 mb-1">Create your account</h1>
          <p className="text-sm text-dark-400 dark:text-dark-500 mb-6">Join the Fixr marketplace today</p>

          {/* Role toggle */}
          <div className="flex gap-1.5 p-1 bg-dark-100 dark:bg-dark-800 rounded-xl mb-5">
            {['user', 'technician'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => set('role', r)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                  form.role === r
                    ? 'bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-100 shadow-sm'
                    : 'text-dark-500 dark:text-dark-400 hover:text-dark-700 dark:hover:text-dark-300'
                }`}
              >
                {r === 'user' ? '👤 Customer' : '🔧 Technician'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input type="text" required className="input" placeholder="John Smith"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input type="email" required className="input" placeholder="you@example.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" required className="input" placeholder="Min. 6 characters"
                value={form.password} onChange={e => set('password', e.target.value)} />
            </div>

            {/* Location fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">City</label>
                <input type="text" className="input" placeholder="New York"
                  value={form.city} onChange={e => set('city', e.target.value)} />
              </div>
              <div>
                <label className="label">Area / District</label>
                <input type="text" className="input" placeholder="Brooklyn"
                  value={form.area} onChange={e => set('area', e.target.value)} />
              </div>
            </div>

            {/* Technician-only fields */}
            {form.role === 'technician' && (
              <div className="animate-in">
                <label className="label">Primary Service</label>
                <select className="input" value={form.service} onChange={e => set('service', e.target.value)} required={form.role === 'technician'}>
                  <option value="">Select a service…</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            <button type="submit" className="btn-primary w-full justify-center py-2.5 mt-1" disabled={loading}>
              {loading ? <><Spinner size="sm" /> Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-dark-400 dark:text-dark-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-dark-300 dark:text-dark-600 mt-4">
          <Link to="/" className="hover:text-brand-500">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
