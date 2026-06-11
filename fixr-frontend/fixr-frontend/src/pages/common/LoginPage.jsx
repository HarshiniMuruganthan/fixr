import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Spinner } from '../../components/ui'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await login(form.email, form.password)
    if (res.success) {
      navigate(res.role === 'admin' ? '/admin' : '/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-brand-400/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-400/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-400 flex items-center justify-center text-white font-display font-bold">F</div>
          <span className="font-display font-bold text-2xl text-dark-900 dark:text-dark-100">Fixr</span>
        </div>

        <div className="card p-7 animate-in">
          <h1 className="font-display font-bold text-xl text-dark-900 dark:text-dark-100 mb-1">Welcome back</h1>
          <p className="text-sm text-dark-400 dark:text-dark-500 mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                required
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => set('password', e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-2.5" disabled={loading}>
              {loading ? <><Spinner size="sm" /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-dark-400 dark:text-dark-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">Create one</Link>
          </p>
        </div>

        <p className="text-center text-xs text-dark-300 dark:text-dark-600 mt-4">
          <Link to="/" className="hover:text-brand-500">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
