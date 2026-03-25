import { useState } from 'react'
import { adminAPI } from '../../api/admin'
import useApi from '../../hooks/useApi'
import { useDebounce } from '../../hooks/useDebounce'
import { Avatar, Spinner, ConfirmDialog, EmptyState } from '../../components/ui'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const ROLES = ['all', 'user', 'technician', 'admin']

export default function AdminUsersPage() {
  const { data: users = [], loading, setData: setUsers } = useApi(() => adminAPI.getUsers(), [], { defaultData: [] })
  const [search, setSearch]   = useState('')
  const [roleFilter, setRole] = useState('all')
  const [deleting, setDel]    = useState(null)
  const [confirmId, setConf]  = useState(null)
  const debouncedSearch       = useDebounce(search, 300)

  const handleDelete = async (id) => {
    setDel(id)
    try {
      await adminAPI.deleteUser(id)
      toast.success('User removed')
      setUsers(u => u.filter(x => x._id !== id))
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setDel(null)
    }
  }

  const filtered = users.filter(u => {
    const matchRole   = roleFilter === 'all' || u.role === roleFilter
    const matchSearch = !debouncedSearch ||
      u.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
    return matchRole && matchSearch
  })

  const counts = ROLES.reduce((a, r) => {
    a[r] = r === 'all' ? users.length : users.filter(u => u.role === r).length
    return a
  }, {})

  return (
    <div className="p-5 sm:p-7 max-w-5xl mx-auto">
      <div className="mb-6 animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">User Management</h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">{users.length} total accounts</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 animate-in stagger-1">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 text-sm">🔍</span>
          <input className="input pl-9" placeholder="Search by name or email…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 p-1 bg-dark-100 dark:bg-dark-800/60 rounded-xl w-fit shrink-0">
          {ROLES.map(r => (
            <button key={r} onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                roleFilter === r
                  ? 'bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-100 shadow-sm'
                  : 'text-dark-500 dark:text-dark-400 hover:text-dark-700'
              }`}>
              {r} <span className="opacity-60 ml-0.5">{counts[r]}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="card divide-y divide-dark-100 dark:divide-dark-800">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 skeleton rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 skeleton rounded w-1/4" />
                <div className="h-3 skeleton rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="👥" title="No users found" description="Try adjusting your filters." />
      ) : (
        <div className="card overflow-hidden animate-in stagger-2">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[auto_1fr_1fr_110px_100px_72px] gap-3 items-center px-4 py-2.5 bg-dark-50 dark:bg-dark-900/50 border-b border-dark-100 dark:border-dark-800">
            {['', 'Name', 'Email', 'Role', 'Joined', ''].map((h, i) => (
              <span key={i} className="text-xs font-semibold text-dark-400 dark:text-dark-500 uppercase tracking-wide">{h}</span>
            ))}
          </div>

          <div className="divide-y divide-dark-100 dark:divide-dark-800">
            {filtered.map((u, i) => (
              <div
                key={u._id}
                className="flex sm:grid sm:grid-cols-[auto_1fr_1fr_110px_100px_72px] items-center gap-3 px-4 py-3 hover:bg-dark-50 dark:hover:bg-dark-800/40 transition-colors animate-in"
                style={{ animationDelay: `${i * 0.025}s` }}
              >
                <Avatar name={u.name} size="sm" className="shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-dark-900 dark:text-dark-100 truncate">{u.name}</p>
                  <p className="text-xs text-dark-400 dark:text-dark-500 sm:hidden truncate">{u.email}</p>
                  {u.service && <p className="text-xs text-dark-400 dark:text-dark-500">{u.service}</p>}
                </div>
                <p className="hidden sm:block text-sm text-dark-500 dark:text-dark-400 truncate">{u.email}</p>
                <div>
                  <span className={`badge capitalize ${
                    u.role === 'admin'      ? 'badge-red'  :
                    u.role === 'technician' ? 'badge-blue' : 'badge-green'
                  }`}>{u.role}</span>
                </div>
                <p className="hidden sm:block text-xs text-dark-400 dark:text-dark-500">{formatDate(u.createdAt)}</p>
                <div className="ml-auto sm:ml-0">
                  <button
                    onClick={() => setConf(u._id)}
                    disabled={deleting === u._id || u.role === 'admin'}
                    className="btn-ghost text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs py-1 px-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {deleting === u._id ? <Spinner size="sm" /> : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConf(null)}
        onConfirm={() => handleDelete(confirmId)}
        title="Delete this user?"
        message="This action is permanent and cannot be undone."
        confirmLabel="Delete User"
        danger
      />
    </div>
  )
}
