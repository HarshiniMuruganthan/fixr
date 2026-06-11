import { adminAPI } from '../../api/admin'
import useApi from '../../hooks/useApi'
import { StatsCard, Spinner } from '../../components/ui'
import { formatCurrency } from '../../utils/helpers'

export default function AdminReportsPage() {
  const { data: users   = [], loading: lu } = useApi(() => adminAPI.getUsers())
  const { data: repairs = [], loading: lr } = useApi(() => adminAPI.getRepairs())
  const loading = lu || lr

  if (loading) return (
    <div className="flex justify-center pt-20"><Spinner size="lg" /></div>
  )

  const byStatus = ['open','in_progress','completed','pending'].map(s => ({
    label: s.replace('_',' '),
    count: repairs.filter(r => r.status === s).length,
    pct: repairs.length ? Math.round(repairs.filter(r => r.status === s).length / repairs.length * 100) : 0,
  }))

  const byRole = ['user','technician','admin'].map(role => ({
    label: role,
    count: users.filter(u => u.role === role).length,
    pct: users.length ? Math.round(users.filter(u => u.role === role).length / users.length * 100) : 0,
  }))

  const serviceMap = users
    .filter(u => u.role === 'technician' && u.service)
    .reduce((a, t) => { a[t.service] = (a[t.service] || 0) + 1; return a }, {})
  const topServices = Object.entries(serviceMap).sort((a,b) => b[1]-a[1]).slice(0, 8)

  const totalBudget = repairs.filter(r => r.budget).reduce((s, r) => s + r.budget, 0)
  const avgBudget   = repairs.filter(r => r.budget).length
    ? totalBudget / repairs.filter(r => r.budget).length
    : 0

  const barPalette = [
    'bg-brand-500','bg-cyan-500','bg-blue-500',
    'bg-emerald-500','bg-amber-500','bg-rose-500','bg-violet-500','bg-pink-500'
  ]

  return (
    <div className="p-5 sm:p-7 max-w-4xl mx-auto space-y-6">
      <div className="animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">Reports & Analytics</h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">Platform health metrics and insights</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in stagger-1">
        <StatsCard label="Total Users"     value={users.length}            icon="👥" color="blue"    />
        <StatsCard label="Technicians"     value={byRole[1].count}         icon="🔧" color="brand"   />
        <StatsCard label="Total Repairs"   value={repairs.length}          icon="📋" color="amber"   />
        <StatsCard label="Avg Budget"      value={formatCurrency(avgBudget)} icon="💰" color="emerald" />
      </div>

      {/* Completion rate hero */}
      <div className="card p-6 bg-gradient-to-br from-brand-500/5 to-cyan-500/5 border-brand-500/20 animate-in stagger-2">
        <p className="text-xs font-bold text-brand-600 dark:text-brand-400 tracking-wide mb-1">PLATFORM COMPLETION RATE</p>
        <div className="flex items-end gap-3">
          <span className="font-display text-5xl font-bold text-dark-900 dark:text-dark-100">
            {repairs.length ? Math.round(byStatus[2].count / repairs.length * 100) : 0}%
          </span>
          <span className="text-sm text-dark-400 dark:text-dark-500 pb-1">
            {byStatus[2].count} of {repairs.length} repairs completed
          </span>
        </div>
        <div className="mt-3 h-2.5 bg-dark-100 dark:bg-dark-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full transition-all duration-1000"
            style={{ width: `${repairs.length ? Math.round(byStatus[2].count / repairs.length * 100) : 0}%` }}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Repair status */}
        <div className="card p-5 animate-in stagger-3">
          <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100 text-sm mb-4">Repairs by Status</h2>
          <div className="space-y-3">
            {byStatus.map((s, i) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="capitalize font-medium text-dark-700 dark:text-dark-300">{s.label}</span>
                  <span className="text-dark-400 dark:text-dark-500">{s.count} · {s.pct}%</span>
                </div>
                <div className="h-2 bg-dark-100 dark:bg-dark-800 rounded-full overflow-hidden">
                  <div className={`h-full ${barPalette[i]} rounded-full transition-all duration-700`}
                    style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User breakdown */}
        <div className="card p-5 animate-in stagger-4">
          <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100 text-sm mb-4">Users by Role</h2>
          <div className="space-y-3">
            {byRole.map((r, i) => (
              <div key={r.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="capitalize font-medium text-dark-700 dark:text-dark-300">{r.label}</span>
                  <span className="text-dark-400 dark:text-dark-500">{r.count} · {r.pct}%</span>
                </div>
                <div className="h-2 bg-dark-100 dark:bg-dark-800 rounded-full overflow-hidden">
                  <div className={`h-full ${barPalette[i + 3]} rounded-full transition-all duration-700`}
                    style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top services */}
        {topServices.length > 0 && (
          <div className="card p-5 sm:col-span-2 animate-in stagger-5">
            <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100 text-sm mb-4">
              Technician Services Distribution
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {topServices.map(([service, count], i) => (
                <div key={service} className="flex items-center gap-3 p-3 rounded-xl bg-dark-50 dark:bg-dark-800/50 hover:bg-dark-100 dark:hover:bg-dark-700/50 transition-colors">
                  <div className={`w-2 h-10 rounded-full shrink-0 ${barPalette[i % barPalette.length]}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-dark-800 dark:text-dark-200 truncate">{service}</p>
                    <p className="text-xs text-dark-400 dark:text-dark-500">
                      {count} technician{count !== 1 ? 's' : ''} ·{' '}
                      {Math.round(count / users.filter(u => u.role === 'technician').length * 100)}% of techs
                    </p>
                  </div>
                  <div className="ml-auto font-display font-bold text-lg text-dark-700 dark:text-dark-300 shrink-0">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
