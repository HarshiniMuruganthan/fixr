// Shared, primitive UI building blocks

import { statusConfig, getInitials } from '../../utils/helpers'

// ── Spinner ──────────────────────────────────────────────────────
export function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }[size]
  return (
    <svg className={`${s} animate-spin text-brand-500 ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

// ── Avatar ────────────────────────────────────────────────────────
export function Avatar({ name, size = 'md', className = '' }) {
  const s = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }[size]
  return (
    <div className={`${s} rounded-xl bg-gradient-to-br from-brand-400 to-cyan-500 flex items-center justify-center font-display font-bold text-white shrink-0 ${className}`}>
      {getInitials(name)}
    </div>
  )
}

// ── StatusBadge ───────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { label: status, cls: 'badge-yellow' }
  return <span className={cfg.cls}>{cfg.label}</span>
}

// ── Skeleton ──────────────────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-dark-950/70 backdrop-blur-sm" />
      <div
        className={`relative w-full ${widths[size]} card p-6 animate-in shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-semibold text-dark-900 dark:text-dark-100">{title}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center mb-4 text-3xl">
        {icon}
      </div>
      <h3 className="text-base font-display font-semibold text-dark-700 dark:text-dark-300 mb-1">{title}</h3>
      {description && <p className="text-sm text-dark-400 dark:text-dark-500 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ── StarRating ────────────────────────────────────────────────────
export function StarRating({ value, onChange, readonly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`text-xl transition-colors ${star <= value ? 'text-yellow-400' : 'text-dark-200 dark:text-dark-700'} ${!readonly ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

// ── StatsCard ─────────────────────────────────────────────────────
export function StatsCard({ label, value, icon, trend, color = 'brand' }) {
  const colors = {
    brand: 'bg-brand-500/10 text-brand-500',
    blue:  'bg-blue-500/10 text-blue-500',
    amber: 'bg-amber-500/10 text-amber-500',
    rose:  'bg-rose-500/10 text-rose-500',
    emerald:'bg-emerald-500/10 text-emerald-500',
  }
  return (
    <div className="card card-hover p-5 animate-in">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors[color]}`}>
          {icon}
        </div>
        {trend != null && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-display font-bold text-dark-900 dark:text-dark-100">{value}</div>
      <div className="text-xs text-dark-400 dark:text-dark-500 mt-0.5">{label}</div>
    </div>
  )
}

// ── ConfirmDialog ─────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-dark-500 dark:text-dark-400 mb-5">{message}</p>
      <div className="flex gap-2 justify-end">
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={() => { onConfirm(); onClose() }}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
