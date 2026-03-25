export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export const formatTime = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  })
}

export const formatCurrency = (amount) => {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(amount)
}

export const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export const statusConfig = {
  open:        { label: 'Open',        cls: 'badge-green'  },
  pending:     { label: 'Pending',     cls: 'badge-yellow' },
  in_progress: { label: 'In Progress', cls: 'badge-blue'   },
  completed:   { label: 'Completed',   cls: 'badge-brand'  },
  accepted:    { label: 'Accepted',    cls: 'badge-green'  },
  rejected:    { label: 'Rejected',    cls: 'badge-red'    },
}

export const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

export const clsx = (...classes) => classes.filter(Boolean).join(' ')
